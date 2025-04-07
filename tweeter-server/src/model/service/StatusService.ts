import { AuthToken, Status, FakeData, StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../../dao-interface/IStatusDAO";
import { DAOFactory } from "../../DAOFactory/DAOFactory";

export class StatusService {
  private statusDAO: IStatusDAO;
  constructor() {
    this.statusDAO = DAOFactory.getStatusDAO();
  }
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize, userAlias);
    return this.statusDAO.loadMoreStoryItems(
      token,
      userAlias,
      pageSize,
      lastItem
    );
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize, userAlias);
    return this.statusDAO.loadMoreFeedItems(
      token,
      userAlias,
      pageSize,
      lastItem
    );
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
    return this.statusDAO.postStatus(token, newStatus);
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      lastItem ? Status.fromDto(lastItem) : null,
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
