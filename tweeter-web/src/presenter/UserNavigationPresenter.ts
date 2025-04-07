import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, UserView, View } from "./Presenter";

export interface UserNavigationView extends UserView {
  getAuthToken(): AuthToken | null;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    await this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());
      const authToken = this.view.getAuthToken();
      const currentUser = this.view.getCurrentUser();

      if (authToken) {
        const user = await this.getUser(authToken, alias);

        if (user) {
          if (currentUser && currentUser.equals(user)) {
            this.view.setDisplayedUser(currentUser);
          } else {
            this.view.setDisplayedUser(user);
          }
        }
      }
    }, "navigate to user");
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
