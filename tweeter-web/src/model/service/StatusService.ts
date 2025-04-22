import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../net/ServerFacade";
import { PagedStatusItemRequest, PostStatusRequest } from "tweeter-shared";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return this.serverFacade.loadMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };

    return this.serverFacade.loadMoreFeedItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<string> {
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus.dto,
      segments: newStatus.segments.map((segment) => segment.dto),
    };

    await this.serverFacade.postStatus(request);
    return "Status Posted!";
  }
}