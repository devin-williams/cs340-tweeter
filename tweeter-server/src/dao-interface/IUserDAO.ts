import { UserDto } from "tweeter-shared";

export interface IUserDAO {
  getUser(alias: string): Promise<UserDto | null>;
  login(alias: string, password: string): Promise<[UserDto, string]>;
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]>;
  logout(token: string): Promise<void>;
}
