import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavBarView extends MessageView {
  clearUserInfo(): void;
}

export class AppNavBarPresenter extends Presenter<AppNavBarView> {
  private _userService: UserService;

  public constructor(view: AppNavBarView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService(): UserService {
    return this._userService;
  }

  public async logOut(authToken: AuthToken): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.displayInfoMessage("Logging Out...", 0);
      await this.userService.logout(authToken);
      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}