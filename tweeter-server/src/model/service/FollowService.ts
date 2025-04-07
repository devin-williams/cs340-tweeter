import { User, FakeData, UserDto } from "tweeter-shared";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { DAOFactory } from "../../DAOFactory/DAOFactory";
import { IFollowDAO } from "../../dao-interface/IFollowDAO";

export class FollowService {

  private followDAO: IFollowDAO;

  constructor() {
    this.followDAO = DAOFactory.getFollowDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize, userAlias);
    return this.followDAO.loadMoreFollowers(token, userAlias, pageSize, lastItem);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize, userAlias);
    return this.followDAO.loadMoreFollowees(token, userAlias, pageSize, lastItem);
  }

  public async getFollowerCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFollowerCount(userAlias);
    return this.followDAO.getFollowerCount(token, userAlias);
  }

  public async getFolloweeCount(
    token: string,
    userAlias: string
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFolloweeCount(userAlias);
    return this.followDAO.getFolloweeCount(token, userAlias);
  }

  public async getIsFollowerStatus(
    token: string,
    userAlias: string,
    selectedUser: string
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.isFollower();
    return this.followDAO.getIsFollowerStatus(token, userAlias, selectedUser);
  }

  public async follow(token: string, userToFollowAlias: string): Promise<[number, number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    // const followerCount = await this.getFollowerCount(token, userToFollowAlias);
    // const followeeCount = await this.getFolloweeCount(token, userToFollowAlias);

    // return [followerCount, followeeCount];
    return this.followDAO.follow(token, userToFollowAlias);
  }

  public async unfollow(token: string, userToUnfollowAlias: string): Promise<[number, number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    // const followerCount = await this.getFollowerCount(token, userToUnfollowAlias);
    // const followeeCount = await this.getFolloweeCount(token, userToUnfollowAlias);

    // return [followerCount, followeeCount];
    return this.followDAO.unfollow(token, userToUnfollowAlias);
  }

  // private async getFakeData(
  //   lastItem: UserDto | null,
  //   pageSize: number,
  //   userAlias: string
  // ): Promise<[UserDto[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfUsers(
  //     User.fromDto(lastItem),
  //     pageSize,
  //     userAlias
  //   );
  //   const dtos = items.map((user) => user.dto);
  //   return [dtos, hasMore];
  // }
}
