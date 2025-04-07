import { AuthPresenter } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {

  public async authenticate(
    alias: string,
    password: string,
    rememberMe: boolean
  ): Promise<void> {
    await this.doAuthenticate(
      () => this.service.login(alias, password),
      rememberMe
    );
  }

  protected getItemDescription(): string {
    return "log in user";
  }
}