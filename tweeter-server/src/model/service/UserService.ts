import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { IUserDAO } from "../../dao-interface/IUserDAO";
import { DAOFactory } from "../../DAOFactory/DAOFactory";

export class UserService {
  private userDAO: IUserDAO;

  constructor() {
    this.userDAO = DAOFactory.getUserDAO();
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
    // const imageStringBase64: string =
      // Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    return await this.userDAO.register(
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension
    );
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser;

    // if (user === null) {
    //   throw new Error("Invalid alias or password");
    // }

    // return [user.dto, FakeData.instance.authToken.token];
    return await this.userDAO.login(alias, password);
  }

  public async logout(token: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    // await new Promise((res) => setTimeout(res, 1000));
    return await this.userDAO.logout(token);
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // const user = FakeData.instance.findUserByAlias(alias);
    // const dto = user ? user.dto : null;
    // return dto;
    return await this.userDAO.getUser(token, alias);
    // return FakeData.instance.findUserByAlias(alias);
  }

//   private async translateUser(user: User): Promise<UserDto> {}
}
