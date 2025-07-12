import type z from "zod";
import type { CreateUserSchema } from "../user/userModel";
import type { LoginResponse } from "./authModel";

export class AuthRepository {
  async registerAsync(
    user: z.infer<typeof CreateUserSchema>
  ): Promise<LoginResponse | null> {
    return null;
  }

  async loginAsync(
    phone: string,
    password: string
  ): Promise<LoginResponse | null> {
    return null;
  }
}
