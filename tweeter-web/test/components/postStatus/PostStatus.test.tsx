import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  let mockUserInstance: any;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    // ✅ Mock user and auth token values
    mockUserInstance = { username: "testUser", displayName: "Test User" };
    mockAuthTokenInstance = { token: "mockAuthToken123" } as AuthToken;

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });
  it("start with the post button and clear button disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables the post button when a status is entered", async () => {
    const { postStatusTextArea, postButton } = renderPostStatusAndGetElements();

    await userEvent.type(postStatusTextArea, "This is a status");

    expect(postButton).toBeEnabled();
  });

  it("enables the clear button when a status is entered", async () => {
    const { postStatusTextArea, clearButton } = renderPostStatusAndGetElements();

    await userEvent.type(postStatusTextArea, "This is a status");

    expect(clearButton).toBeEnabled();
  });

  it("disables the post button when status is cleared", async () => {
    const { postStatusTextArea, postButton } = renderPostStatusAndGetElements();

    await userEvent.type(postStatusTextArea, "This is a status");
    expect(postButton).toBeEnabled();
    userEvent.clear(postStatusTextArea);

    expect(postButton).toBeDisabled();
  });

  it("disables the clear button when status is cleared", async () => {
    const { postStatusTextArea, clearButton } = renderPostStatusAndGetElements();

    await userEvent.type(postStatusTextArea, "This is a status");
    expect(clearButton).toBeEnabled();
    userEvent.clear(postStatusTextArea);

    expect(clearButton).toBeDisabled();
  });

  it("calls the presenters postStatus method with correct parameters when the post button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    
    const { postStatusTextArea, postButton, user } = renderPostStatusAndGetElements(mockPresenterInstance);

    await userEvent.type(postStatusTextArea, "This is a status");
    await user.click(postButton);

    verify(mockPresenter.postStatus(mockAuthTokenInstance, mockUserInstance, "This is a status")).once();
  });

});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusTextArea = screen.getByLabelText("postStatus");
  // const postButton = screen.getByLabelText("postStatusButton");
  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByLabelText("clearStatusButton");

  // console.log(postButton);

  return { postStatusTextArea, postButton, clearButton, user };
};
