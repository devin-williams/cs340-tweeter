import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { anything, capture, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("start with the sign in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");

    expect(signInButton).toBeDisabled();
  });

    it("enables the sign in button when both alias and password are entered", async () => {
        const { signInButton, aliasInput, passwordInput } = renderLoginAndGetElements("/");
    
        await userEvent.type(aliasInput, "jondoe123");
        await userEvent.type(passwordInput, "password");
    
        expect(signInButton).toBeEnabled();
    });

    it("disables the sign in button when alias is cleared", async () => {
        const { signInButton, aliasInput, passwordInput } = renderLoginAndGetElements("/");
    
        await userEvent.type(aliasInput, "jondoe123");
        await userEvent.type(passwordInput, "password");
        expect(signInButton).toBeEnabled();
        userEvent.clear(aliasInput);
    
        expect(signInButton).toBeDisabled();
    });

    it("disables the sign in button when password is cleared", async () => {
        const { signInButton, aliasInput, passwordInput } = renderLoginAndGetElements("/");
    
        await userEvent.type(aliasInput, "jondoe123");
        await userEvent.type(passwordInput, "password");
        expect(signInButton).toBeEnabled();
        userEvent.clear(passwordInput);
    
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const rememberMe = true;
        const alias = "@SomeAlias";
        const password = "myPassword";


        const { signInButton, aliasInput, passwordInput, rememberMeCheckbox, user } = renderLoginAndGetElements("/", mockPresenterInstance);

        await user.type(aliasInput, alias);
        await user.type(passwordInput, password);
        await user.click(rememberMeCheckbox);

        await user.click(signInButton);

        verify(mockPresenter.authenticate(alias, password, rememberMe)).once();

        // const [capturedAlias, capturedPassword, capturedRememberMe] = capture(mockPresenter.authenticate).last();
        // console.log(capturedAlias);
        // console.log(capturedPassword);
        // console.log(capturedRememberMe);
    });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
        {!!presenter ? (
            <Login originalUrl={originalUrl} presenter={presenter} />
        ) : (
            <Login originalUrl={originalUrl} />
        )}
    </MemoryRouter>
  );
};


const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByLabelText("submitButton");
  const aliasInput = screen.getByLabelText("alias");
  const passwordInput = screen.getByLabelText("password");
  const rememberMeCheckbox = screen.getByLabelText("remember-me");

  return { signInButton, aliasInput, passwordInput, rememberMeCheckbox, user };
};
