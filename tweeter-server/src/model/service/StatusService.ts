import { StatusDto } from "tweeter-shared";
import { IStatusDAO } from "../../dao-interface/IStatusDAO";
import { DAOFactory } from "../../DAOFactory/DAOFactory";
import { ISessionDAO } from "../../dao-interface/ISessionDAO";

export class StatusService {
  private statusDAO: IStatusDAO;
  private sessionDAO: ISessionDAO;
  constructor() {
    this.statusDAO = DAOFactory.getStatusDAO();
    this.sessionDAO = DAOFactory.getSessionDAO();
  }
  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize, userAlias);
    await this.sessionDAO.isTokenValid(token);

    return this.statusDAO.loadMoreStoryItems(
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
    await this.sessionDAO.isTokenValid(token);
    return this.statusDAO.loadMoreFeedItems(
      userAlias,
      pageSize,
      lastItem
    );
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<void> {
    await this.sessionDAO.isTokenValid(token);
    const alias = await this.sessionDAO.getAliasForToken(token);
    return this.statusDAO.postStatus(alias, newStatus);
  }
}
