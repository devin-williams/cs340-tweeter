import { UserDto } from "tweeter-shared";
import { IUserDAO } from "../../dao-interface/IUserDAO";
import { DAOFactory } from "../../DAOFactory/DAOFactory";
import { IFollowDAO } from "../../dao-interface/IFollowDAO";
import { ISessionDAO } from "../../dao-interface/ISessionDAO";

export class UserService {
  private userDAO: IUserDAO;
  private sessionDAO: ISessionDAO;
  // private followDAO: IFollowDAO;

  constructor() {
    this.userDAO = DAOFactory.getUserDAO();
    this.sessionDAO = DAOFactory.getSessionDAO();
    // this.followDAO = DAOFactory.getFollowDAO();
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, string]> {
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
    return await this.userDAO.login(alias, password);
  }

  public async logout(token: string): Promise<void> {

    await this.sessionDAO.isTokenValid(token);

    return await this.sessionDAO.deleteToken(token);
  }

  public async getUser(
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    await this.sessionDAO.isTokenValid(token);
    return await this.userDAO.getUser(alias);

  }
}
