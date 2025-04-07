import { FollowService } from "../model/service/FollowService";
import { AuthToken, User } from "tweeter-shared";
import { LoadingView, MessageView, Presenter, UserView } from "./Presenter";

export interface UserInfoView extends MessageView, LoadingView, UserView {
  setIsFollower(isFollower: boolean): void;
  setFollowerCount(count: number): void;
  setFolloweeCount(count: number): void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private followService: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.followService = new FollowService();
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.followService.getFollowerCount(authToken, user);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    return this.followService.getFolloweeCount(authToken, user);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    return this.followService.getIsFollowerStatus(
      authToken,
      user,
      selectedUser
    );
  }

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);
      const [followerCount, followeeCount] = await this.followService.follow(
        authToken,
        displayedUser
      );
      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);
      const [followerCount, followeeCount] = await this.followService.unfollow(
        authToken,
        displayedUser
      );
      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
        this.view.setIsFollower(isFollower);
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const followeeCount = await this.getFolloweeCount(
        authToken,
        displayedUser
      );
      this.view.setFolloweeCount(followeeCount);
    }, "get followees count");
  }

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const followerCount = await this.getFollowerCount(
        authToken,
        displayedUser
      );
      this.view.setFollowerCount(followerCount);
    }, "get followers count");
  }

  public switchToLoggedInUser(currentUser: User): void {
    this.view.setDisplayedUser(currentUser);
  }

  public async fetchUserInfo(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ): Promise<void> {
    if (authToken && currentUser && displayedUser) {
      await this.setIsFollowerStatus(authToken, currentUser, displayedUser);
      await this.setNumbFollowees(authToken, displayedUser);
      await this.setNumbFollowers(authToken, displayedUser);
    }
  }
}
