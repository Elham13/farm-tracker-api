import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { UserService } from "@/api/user/userService";

vi.mock("@/api/user/userRepository");

describe("userService", () => {
  let userServiceInstance: UserService;
  let userRepositoryInstance: UserRepository;

  const mockUsers: User[] = [
    {
      _id: "686f9e8a07c77bc9afcdd546",
      name: "Alice",
      email: "alice@example.com",
      phone: "92883883884",
      password: "abc123",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
    },
    {
      _id: "686f9e8a07c77bc9afcdd547",
      name: "Robert",
      email: "Robert@example.com",
      phone: "92883883884",
      password: "abc123",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
    },
  ];

  beforeEach(() => {
    userRepositoryInstance = new UserRepository();
    userServiceInstance = new UserService(userRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all users", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockUsers);

      // Act
      const result = await userServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Fetched");
      expect(result.responseObject).toEqual(mockUsers);
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const result = await userServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals(
        "An error occurred while retrieving users."
      );
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a user for a valid ID", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afcdd546";
      const mockUser = mockUsers.find((user) => user._id === testId);
      (userRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockUser);

      // Act
      const result = await userServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Fetched");
      expect(result.responseObject).toEqual(mockUser);
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afcdd546";
      (userRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const result = await userServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while finding user.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afcdd546";
      (userRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("User not found");
      expect(result.responseObject).toBeNull();
    });
  });
});
