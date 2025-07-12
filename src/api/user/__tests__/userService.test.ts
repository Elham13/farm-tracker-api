import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import type { TUser } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";

vi.mock("@/api/user/userRepository");

describe("userService", () => {
  let userRepositoryInstance: UserRepository;

  const mockUsers: TUser[] = [
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
  });

  describe("findAll", () => {
    it("return all users", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockUsers);

      // Act
      const result = await userRepositoryInstance.findAllAsync();
      const serviceResponse = ServiceResponse.success<TUser[]>(
        "Fetched",
        result
      );

      // Assert
      expect(serviceResponse.statusCode).toEqual(StatusCodes.OK);
      expect(serviceResponse.success).toBeTruthy();
      expect(serviceResponse.message).equals("Fetched");
      expect(serviceResponse.data).toEqual(mockUsers);
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const result = await userRepositoryInstance.findAllAsync();
      const serviceResponse = ServiceResponse.failure("Fetched", result);

      // Assert
      expect(serviceResponse.statusCode).toEqual(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(serviceResponse.success).toBeFalsy();
      expect(serviceResponse.data).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a user for a valid ID", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afcdd546";
      const mockUser = mockUsers.find((user) => user._id === testId);
      (userRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockUser);

      // Act
      const result = await userRepositoryInstance.findByIdAsync(testId);
      const serviceResponse = ServiceResponse.success<TUser | null>(
        "Fetched",
        result
      );

      // Assert
      expect(serviceResponse.statusCode).toEqual(StatusCodes.OK);
      expect(serviceResponse.success).toBeTruthy();
      expect(serviceResponse.message).equals("Fetched");
      expect(serviceResponse.data).toEqual(mockUser);
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afcdd546";
      (userRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Act
      const result = await userRepositoryInstance.findByIdAsync(testId);
      const serviceResponse = ServiceResponse.failure(
        "Error getting user by id",
        result
      );

      // Assert
      expect(serviceResponse.statusCode).toEqual(
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      expect(serviceResponse.success).toBeFalsy();
      expect(serviceResponse.message).equals("Error getting user by id");
      expect(serviceResponse.data).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afcdd546";
      (userRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userRepositoryInstance.findByIdAsync(testId);
      const serviceResponse = ServiceResponse.failure("User not found", result);

      // Assert
      expect(serviceResponse.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(serviceResponse.success).toBeFalsy();
      expect(serviceResponse.message).equals("User not found");
      expect(serviceResponse.data).toBeNull();
    });
  });
});
