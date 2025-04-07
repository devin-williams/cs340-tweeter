import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { LoadingView, MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView, LoadingView {
  clearPost(): void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService(): StatusService {
    return this._statusService;
  }

  public async postStatus(
    authToken: AuthToken,
    currentUser: User,
    post: string
  ): Promise<void> {
    this.view.setIsLoading(true);
    this.view.displayInfoMessage("Posting status...", 0);

    await this.doFailureReportingOperation(async () => {
      const status = new Status(post, currentUser, Date.now());
      await this.statusService.postStatus(authToken, status);

      this.view.clearPost();
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
