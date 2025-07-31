import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { TUser } from "@/api/user/userModel";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("User API Endpoints", () => {
  describe("GET /users", () => {
    it("should return a list of users", async () => {
      // Act
      const response = await request(app).get("/users");
      const responseBody: ServiceResponse<TUser[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Fetched");
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user for a valid ID", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afcdd546";

      // Act
      const response = await request(app).get(`/users/${testId}`);
      const responseBody: ServiceResponse<TUser> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Fetched");
    });

    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = "686f9e8a07c77bc9afc3d546";

      // Act
      const response = await request(app).get(`/users/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("User not found");
      expect(responseBody.data).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      // Act
      const invalidInput = "abc";
      const response = await request(app).get(`/users/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid input");
      expect(responseBody.data).toBeNull();
    });
  });
});

function compareUsers(mockUser: TUser, responseUser: TUser) {
  if (!mockUser || !responseUser) {
    throw new Error("Invalid test data: mockUser or responseUser is undefined");
  }

  expect(responseUser._id).toEqual(mockUser._id);
  expect(responseUser.name).toEqual(mockUser.name);
  expect(responseUser.phone).toEqual(mockUser.phone);
  expect(responseUser.password).toEqual(mockUser.password);
  expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
  expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
}
