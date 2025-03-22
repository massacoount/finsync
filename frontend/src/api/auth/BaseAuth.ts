import type User from "@/models/user";

export abstract class BaseAuth {
  abstract login(email: string, password: string): Promise<User>;
  abstract register(email: string, password: string): Promise<User>;
  abstract logout(): Promise<void>;
}
