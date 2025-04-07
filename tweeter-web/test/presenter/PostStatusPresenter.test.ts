import { AuthToken, Status, User } from "tweeter-shared";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import { anyOfClass, anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let mockStatusService: StatusService;
    let postStatusPresenter: PostStatusPresenter;

    const authToken = new AuthToken("abc123", Date.now());
    const currentUser = new User("John", "Doe", "jondoe123", "imageUrl");
    const post = "Hello, world!";
    const status = new Status(post, currentUser, Date.now());

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));

        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the status service with the correct auth token and status", async () => {
        await postStatusPresenter.postStatus(authToken, currentUser, post);



        verify(mockStatusService.postStatus(authToken, anything())).once();

        const [capturedAuthToken, capturedStatus] = capture(mockStatusService.postStatus).last();
        expect(capturedAuthToken).toEqual(authToken);
        expect(capturedStatus.post).toEqual(post);
        expect(capturedStatus.user).toEqual(currentUser);
        expect(capturedStatus.segments).toEqual([{ _text: post, _startPostion: 0, _endPosition: post.length, _type: "Text" }]);
    });

    it("tells the view to clear the last info message when posting status is successful", async () => {
        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.clearLastInfoMessage()).once();
    });

    it("tells the view to clear the post when posting status is successful", async () => {
        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.clearPost()).once();
    });

    it("tells the view to display a status posted message when posting status is successful", async () => {
        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    });

    it("tells the view to stop loading when posting status is successful", async () => {
        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.setIsLoading(false)).once();
    });

    it("does not display an error message when posting status is successful", async () => {
        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.displayErrorMessage(anything())).never();
    });

    it("tells the view to clear the last info message when posting status fails", async () => {
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(new Error("Something went wrong"));

        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.clearLastInfoMessage()).once();
    });

    it("tells the view to stop loading when posting status fails", async () => {
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(new Error("Something went wrong"));

        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.setIsLoading(false)).once();
    });

    it("displays an error message when posting status fails", async () => {
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(new Error("Something went wrong"));

        await postStatusPresenter.postStatus(authToken, currentUser, post);

        const errorMessage = "Failed to post the status because of exception: Something went wrong";

        verify(mockPostStatusView.displayErrorMessage(errorMessage)).once();
    });

    it("does not clear the post when posting status fails", async () => {
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(new Error("Something went wrong"));

        await postStatusPresenter.postStatus(authToken, currentUser, post);

        verify(mockPostStatusView.clearPost()).never();
    });
});