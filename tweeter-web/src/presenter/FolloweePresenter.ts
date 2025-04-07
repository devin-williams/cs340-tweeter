import { PAGE_SIZE } from "./PagedItemPresenter";
import { UserItemPresenter } from "./UserItemPresenter";
import { AuthToken, User } from "tweeter-shared";

export class FolloweePresenter extends UserItemPresenter {
  protected getItemDescription(): string {
    return "load followees";
  }

  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }
}
