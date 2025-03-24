import { BaseAuth } from "./BaseAuth";
import { httpClient } from "../http-client";
import type User from "@/models/user";
import axios, { AxiosError } from "axios";
import { ApiError } from "../api-error";

export class DefaultAuth extends BaseAuth {
  login(email: string, password: string): Promise<User> {
    return httpClient
      .post<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
      }>(
        `/auth/token`,
        new URLSearchParams({
          grant_type: "password",
          username: email,
          password: password,
          client_id: "web-app",
          client_secret: "secret",
          scope: "",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      )
      .then(async (response) => {
        const { data } = response;
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        const userResponse = await this.getUser();
        const user: User = {
          id: "",
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          accessTokenExpiresAt: data.expires_in,
          accessTokenType: data.token_type,
          name: userResponse.name,
          email: userResponse.email,
          avatar: "",
          provider: "default",
          emailVerified: userResponse.email_verified,
          lastLogin: "",
          roles: [],
          permissions: [],
          createdAt: "",
          updatedAt: "",
        };
        return user;
      })
      .catch((error: AxiosError) => {
        console.error("Error in fetching token", error);
        if (error.response?.status === 400) {
          throw new ApiError("Invalid username or password", "warning");
        } else if (error.response?.status === 401) {
          throw new ApiError("Invalid credentials", "warning");
        }
        throw new ApiError("Unknown error occurred", "error");
      });
  }

  register(user: Partial<User>, password: string): Promise<User> {
    console.debug("Register method not implemented", user, password);
    throw new Error("Method not implemented.");
  }

  private getUser(): Promise<{
    name: string;
    email: string;
    email_verified: boolean;
  }> {
    return httpClient
      .get<{
        name: string;
        email: string;
        email_verified: boolean;
      }>(`/auth/userinfo`)
      .then((response) => response.data)
      .catch((error) => {
        console.log("Error fetching user info:", error);
        throw new Error("Failed to retrieve user");
      });
  }

  logout(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
