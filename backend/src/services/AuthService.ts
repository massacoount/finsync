import { getRepository } from "typeorm";
import { AuthProvider, TokenResponse, UserProfile } from "@finsync/shared";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuthClientEntity } from "../entity/OauthClient";
import { UserEntity } from "../entity/User";
import { Secret, SignOptions } from "jsonwebtoken";
import { injectable } from "tsyringe";
import config from "../config";
import { CustomError } from "../models/CustomError";

@injectable()
export class AuthService {
  private userRepository = getRepository(UserEntity);
  private oauthClientRepository = getRepository(OAuthClientEntity);

  async getAccessToken(params: {
    provider: AuthProvider;
    grant_type: "password" | "authorization_code";
    username?: string;
    password?: string;
    client_id: string;
    client_secret: string;
    scope?: string;
  }): Promise<TokenResponse> {
    await this.validateClient(params.client_id, params.client_secret);
    let user: UserProfile;
    if (params.grant_type === "password") {
      if (!params.username || !params.password) {
        throw new CustomError(
          "Username and password are required for password grant type",
          400
        );
      }
      user = await this.validateCredentials(
        params.username,
        params.password,
        params.provider
      );
    } else {
      throw new CustomError("Authorization code grant type not implemented", 501);
    }

    return this.generateTokens(user);
  }

  async refreshToken(params: {
    provider: AuthProvider;
    refresh_token: string;
    client_id: string;
    client_secret: string;
    scope?: string;
  }): Promise<TokenResponse> {
    await this.validateClient(params.client_id, params.client_secret);
    const user = await this.validateRefreshToken(params.refresh_token);
    return this.generateTokens(user);
  }

  private async validateClient(
    clientId: string,
    clientSecret: string
  ): Promise<void> {
    const client = await this.oauthClientRepository.findOne({
      where: { clientId, clientSecret }
    });

    if (!client) {
      throw new CustomError("Invalid client credentials", 401);
    }
  }

  private async validateCredentials(
    username: string,
    password: string,
    provider: AuthProvider
  ): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: { email: username, provider }
    });

    if (!user) {
      throw new CustomError("Invalid credentials", 401);
    }

    const isValid = await bcrypt.compare(password, `${user.password}`);

    if (!isValid) {
      throw new CustomError("Invalid credentials", 401);
    }

    return {
      id: user.id,
      email: `${user.email}`,
      name: `${user.name}`,
      provider: provider,
      picture: user.picture,
    };
  }

  private async validateRefreshToken(
    refreshToken: string
  ): Promise<UserProfile> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
      const user = await this.userRepository.findOne({
        where: { id: decoded.id }
      });
      if (!user) {
        throw new CustomError("Invalid refresh token", 401);
      }
      return {
        id: user.id,
        email: `${user.email}`,
        name: `${user.name}`,
        provider: user.provider || AuthProvider.LOCAL,
        picture: user.picture,
      };
    } catch (error) {
      throw new CustomError("Invalid refresh token", 401);
    }
  }

  private generateTokens(user: UserProfile): TokenResponse {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret as Secret,
      { expiresIn: config.jwtExpiresIn } as SignOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      config.jwtRefreshSecret as Secret,
      { expiresIn: "7d" } as SignOptions
    );

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      tokenType: "Bearer",
      expiresIn:
        typeof config.jwtExpiresIn === "string"
          ? parseInt(config.jwtExpiresIn)
          : config.jwtExpiresIn,
    };
  }
}