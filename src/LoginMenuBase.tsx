import React, { Component } from "react";
// import { NavLink } from "reactstrap";
// import { Button } from '@mui/material'
import { Link } from "react-router-dom";
// import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authService, ApplicationPaths } from "partner-oidc-auth";
import { ILoginMenuProps, ILoginMenuState, ILogoutPath } from "./type";

const Button: React.FC<
  React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>
> = (props) => <button {...props} />;

const SignInIcon: React.FC<any> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
  >
    <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
  </svg>
);

const NavLink: React.FC<any> = (props) => (
  <Link {...props} className={props.className}>
    {props.children}
  </Link>
); // Placeholder for NavLink
export class LoginMenuBase extends Component<ILoginMenuProps, ILoginMenuState> {
  constructor(props: ILoginMenuProps) {
    super(props);

    this.state = {
      isAuthenticated: false,
    };
  }
  _subscription?: number;
  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState());
    this.populateState();
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription ?? 0);
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([
      authService.isAuthenticated(),
      authService.getUser(),
    ]);
    this.setState({
      isAuthenticated,
      userName: user?.name,
      avatar: user?.picture,
    });
  }

  render() {
    const { isAuthenticated, userName } = this.state;
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`;
      const loginPath = `${ApplicationPaths.Login}`;
      return this.anonymousView(registerPath, loginPath);
    } else {
      const profilePath = `${ApplicationPaths.Profile}`;
      const logoutPath: ILogoutPath = {
        pathname: `${ApplicationPaths.LogOut}`,
        state: { local: true },
      };
      return this.authenticatedView(userName ?? "", profilePath, logoutPath);
    }
  }

  authenticatedView(
    userName: string,
    profilePath: string,
    logoutPath: ILogoutPath
  ) {
    const { AvatarButton } = this.props;
    return (
      <>
        <AvatarButton
          urlAvatar={this.state.avatar}
          profilePath={profilePath}
          logoutPath={logoutPath}
        >
          {userName}
        </AvatarButton>
        {/* <NavItem>
          <NavLink tag={Link} className="text-dark" to={profilePath}>
            Hello {userName}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} className="text-dark" to={logoutPath}>
            Logout
          </NavLink>
        </NavItem> */}
      </>
    );
  }

  anonymousView(registerPath: string, loginPath: string) {
    return (
      <>
        <Button style={{ padding: 0 }}>
          <NavLink tag={Link} className="text-primary" to={loginPath}>
            <span className="mr-1">
              <SignInIcon />
            </span>
            Login
          </NavLink>
        </Button>
      </>
    );
  }
}
