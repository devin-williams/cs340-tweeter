import { UserDto } from "tweeter-shared";
import { DAOFactory } from "../../DAOFactory/DAOFactory";
import { IFollowDAO } from "../../dao-interface/IFollowDAO";
import { ISessionDAO } from "../../dao-interface/ISessionDAO";

export class FollowService {

  private followDAO: IFollowDAO;
  private sessionDAO: ISessionDAO;

  constructor() {
    this.followDAO = DAOFactory.getFollowDAO();
    this.sessionDAO = DAOFactory.getSessionDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.sessionDAO.isTokenValid(token);
    return this.followDAO.loadMoreFollowers(userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    await this.sessionDAO.isTokenValid(token);
    return this.followDAO.loadMoreFollowees(userAlias, pageSize, lastItem);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.sessionDAO.isTokenValid(token);
    return this.followDAO.getFollowerCount(userAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    await this.sessionDAO.isTokenValid(token);
    return this.followDAO.getFolloweeCount(userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUser: string
  ): Promise<boolean> {
    await this.sessionDAO.isTokenValid(token);
    return this.followDAO.getIsFollowerStatus(userAlias, selectedUser);
  }

  public async follow(token: string, userToFollowAlias: string): Promise<[number, number]> {
    await this.sessionDAO.isTokenValid(token);
    const followerAlias = await this.sessionDAO.getAliasForToken(token);

    return this.followDAO.follow(followerAlias, userToFollowAlias);
  }

  public async unfollow(token: string, userToUnfollowAlias: string): Promise<[number, number]> {
    await this.sessionDAO.isTokenValid(token);
    const followerAlias = await this.sessionDAO.getAliasForToken(token);
    return this.followDAO.unfollow(followerAlias, userToUnfollowAlias);
  }
}
