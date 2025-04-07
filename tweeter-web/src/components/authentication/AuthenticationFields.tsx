import React from "react";

interface Props {
  alias: string;
  setAlias: (alias: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onEnter: (event: React.KeyboardEvent<HTMLElement>) => void;
}

const AuthenticationFields = (props: Props) => {
  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
          placeholder="name@example.com"
          onKeyDown={props.onEnter}
          onChange={(event) => props.setAlias(event.target.value)}
          value={props.alias}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          onKeyDown={props.onEnter}
          onChange={(event) => props.setPassword(event.target.value)}
          value={props.password}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationFields;