import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigateToHome: () => void;
}

export abstract class AuthPresenter extends Presenter<AuthView> {  
    private _alias: string = "";
    private _password: string = "";
    private _rememberMe: boolean = false;
    private _isLoading: boolean = false;
    private _service: UserService;
  
    public constructor(view: AuthView) {
      super(view);
      this._service = new UserService();
    }

    protected get service(): UserService {
      return this._service;
    }
  
    public get alias(): string {
      return this._alias;
    }
  
    public set alias(value: string) {
      this._alias = value;
    }
  
    public get password(): string {
      return this._password;
    }
  
    public set password(value: string) {
      this._password = value;
    }
  
    public get rememberMe(): boolean {
      return this._rememberMe;
    }
  
    public set rememberMe(value: boolean) {
      this._rememberMe = value;
    }
  
    public get isLoading(): boolean {
      return this._isLoading;
    }
  
    protected set isLoading(value: boolean) {
      this._isLoading = value;
    }
  
    // Make unnecessary parameters optional for LoginPresenter
    public abstract authenticate(
      alias: string,
      password: string,
      rememberMe?: boolean,
      firstName?: string,
      lastName?: string,
      imageBytes?: Uint8Array,
      imageFileExtension?: string
    ): Promise<void>;

    protected async doAuthenticate(
      operation: () => Promise<[User, AuthToken]>,
      rememberMe: boolean
    ): Promise<void> {
      this.doFailureReportingOperation(async () => {
        this.isLoading = true;

        const [user, authToken] = await operation();

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.view.navigateToHome();
    }, this.getItemDescription());

    this.isLoading = false;
  }

    protected abstract getItemDescription(): string;
  }
  