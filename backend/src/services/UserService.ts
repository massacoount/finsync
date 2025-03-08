import { getRepository } from "typeorm";
import { UserProfile } from "@finsync/shared";
import { injectable } from "tsyringe";
import { UserEntity } from "../entity/User";
import bcrypt from "bcryptjs";

@injectable()
export class UserService {
  private userRepository = getRepository(UserEntity);

  async getUsers(): Promise<UserProfile[]> {
    const users = await this.userRepository.find();
    return users.map(user => ({
      id: user.id!,
      email: user.email!,
      name: user.name!,
      picture: user.picture!,
      provider: user.provider!
    }));
  }

  async createUser(data: any): Promise<UserProfile> {
    const { email, password, name, picture, provider } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ email, password: hashedPassword, name, picture, provider });
    const savedUser = await this.userRepository.save(user);
    return this.getUser((savedUser as UserEntity).id!);
  }

  async getUser(id: string): Promise<UserProfile> {
    const user = await this.userRepository.findOne(id) as UserEntity;
    return {
      id: user.id!,
      email: user.email!,
      name: user.name!,
      picture: user.picture!,
      provider: user.provider!
    };
  }

  async updateUser(id: string, data: any): Promise<UserProfile> {
    await this.userRepository.update(id, data);
    return this.getUser(id);
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
