import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../net/ServerFacade";
import {
  RegisterRequest,
  LoginRequest,
  LogoutRequest,
  GetUserRequest,
} from "tweeter-shared";

export class UserService {
  private serverFacade = new ServerFacade();

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    // // Check if user already exists
    // const existingUser: User | null = await this.serverFacade.getUser({
    //   token: "",
    //   alias,
    // });
    // if (existingUser) {
    //   throw new Error(`User with alias ${alias} already exists`);
    // }

    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: imageStringBase64,
      imageFileExtension,
    };


    return this.serverFacade.register(request);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias,
      password,
    };

    return this.serverFacade.login(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: LogoutRequest = {
      token: authToken.token,
    };

    return this.serverFacade.logout(request);
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      alias,
    };

    return this.serverFacade.getUser(request);
  }
}