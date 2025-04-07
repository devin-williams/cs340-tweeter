import { AuthToken } from "tweeter-shared";
import { AppNavBarPresenter, AppNavBarView } from "../../src/presenter/AppNavBarPresenter";
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavBarPresenter", () => {
    let mockAppNavBarView: AppNavBarView;
    let mockUserService: UserService;
    let appNavBarPresenter: AppNavBarPresenter;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavBarView = mock<AppNavBarView>();
        // mockUserService = mock(UserService);
        const mockAppNavBarViewInstance = instance(mockAppNavBarView);
        // const mockUserServiceInstance = instance(mockUserService);

        const appNavBarPresenterSpy = spy(new AppNavBarPresenter(mockAppNavBarViewInstance));

        appNavBarPresenter = instance(appNavBarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavBarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
        // Inject the mocked UserService instance
        // (appNavBarPresenter as any)._userService = mockUserServiceInstance;
    });

    it("tells the view to display a logging out message", async () => {
        await appNavBarPresenter.logOut(authToken);

        verify(mockAppNavBarView.displayInfoMessage("Logging Out...", 0)).once();
        // verify(mockAppNavBarView.clearLastInfoMessage()).once();
        // verify(mockAppNavBarView.clearUserInfo()).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavBarPresenter.logOut(authToken);

        verify(mockUserService.logout(authToken)).once();

        // verify(mockUserService.logout(anything())).once();
        // let [capturedAuthToken] = capture(mockUserService.logout).last();
        // expect(capturedAuthToken).toEqual(authToken);
    });

    it("tells the view to clear the last info message when logout is successful", async () => {
        await appNavBarPresenter.logOut(authToken);

        verify(mockAppNavBarView.clearLastInfoMessage()).once();
    });

    it("tells the view to clear the user info when logout is successful", async () => {
        await appNavBarPresenter.logOut(authToken);

        verify(mockAppNavBarView.clearUserInfo()).once();
    });

    it("does not display an error message when logout is successful", async () => {
        await appNavBarPresenter.logOut(authToken);

        verify(mockAppNavBarView.displayErrorMessage(anything())).never();
    });

    it("displays an error message when logout fails", async () => {
        when(mockUserService.logout(authToken)).thenThrow(new Error("Failed to log out"));

        await appNavBarPresenter.logOut(authToken);

        const errorMessage = "Failed to log user out because of exception: Failed to log out";

        verify(mockAppNavBarView.displayErrorMessage(errorMessage)).once();
    });

    it("does not clear the last info message when logout fails", async () => {
        when(mockUserService.logout(authToken)).thenThrow(new Error("Failed to log out"));

        await appNavBarPresenter.logOut(authToken);

        verify(mockAppNavBarView.clearLastInfoMessage()).never();
    });

    it("does not clear the user info when logout fails", async () => {
        when(mockUserService.logout(authToken)).thenThrow(new Error("Failed to log out"));

        await appNavBarPresenter.logOut(authToken);

        verify(mockAppNavBarView.clearUserInfo()).never();
    });
});
