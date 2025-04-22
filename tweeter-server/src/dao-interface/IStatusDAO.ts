import { StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  loadMoreStoryItems(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  loadMoreFeedItems(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  postStatus(alias: string, newStatus: StatusDto): Promise<void>;
}
