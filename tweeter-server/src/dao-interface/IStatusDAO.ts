import { StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  loadMoreStoryItems(token: string, alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  loadMoreFeedItems(token: string, alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  postStatus(token: string, newStatus: StatusDto): Promise<void>;
}
