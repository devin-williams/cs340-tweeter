import { User, FakeData } from "tweeter-shared";
import { AuthToken } from "tweeter-shared/dist/model/domain/AuthToken";
import { ServerFacade } from "../net/ServerFacade";
import {
  FollowerStatusRequest,
  FollowRequest,
  UnfollowRequest,
  UserCountRequest,
  PagedUserItemRequest,
} from "tweeter-shared";

export class FollowService {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return this.serverFacade.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return this.serverFacade.getMoreFollowees(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: UserCountRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };

    return this.serverFacade.getFollowerCount(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: UserCountRequest = {
      token: authToken.token,
      userAlias: user.alias,
    };

    return this.serverFacade.getFolloweeCount(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: FollowerStatusRequest = {
      token: authToken.token,
      userAlias: user.alias,
      selectedAlias: selectedUser.alias,
    };

    return this.serverFacade.getIsFollowerStatus(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[number, number]> {
    const request: FollowRequest = {
      token: authToken.token,
      userToFollowAlias: userToFollow.alias,
    };

    return this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[number, number]> {
    const request: UnfollowRequest = {
      token: authToken.token,
      userToUnfollowAlias: userToUnfollow.alias,
    };

    return this.serverFacade.unfollow(request);
  }
}