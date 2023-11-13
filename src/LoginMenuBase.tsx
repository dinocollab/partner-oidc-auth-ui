import React, { Component } from 'react'
import { NavLink } from 'reactstrap'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { authService, ApplicationPaths } from 'partner-oidc-auth'
import { ILoginMenuProps, ILoginMenuState, ILogoutPath } from './type'

export class LoginMenuBase extends Component<ILoginMenuProps, ILoginMenuState> {
  constructor(props: ILoginMenuProps) {
    super(props)

    this.state = {
      isAuthenticated: false,
    }
  }
  _subscription?: number
  componentDidMount() {
    this._subscription = authService.subscribe(() => this.populateState())
    this.populateState()
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription ?? 0)
  }

  async populateState() {
    const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()])
    this.setState({
      isAuthenticated,
      userName: user?.name,
      avatar: user?.picture,
    })
  }

  render() {
    const { isAuthenticated, userName } = this.state
    if (!isAuthenticated) {
      const registerPath = `${ApplicationPaths.Register}`
      const loginPath = `${ApplicationPaths.Login}`
      return this.anonymousView(registerPath, loginPath)
    } else {
      const profilePath = `${ApplicationPaths.Profile}`
      const logoutPath: ILogoutPath = {
        pathname: `${ApplicationPaths.LogOut}`,
        state: { local: true },
      }
      return this.authenticatedView(userName ?? '', profilePath, logoutPath)
    }
  }

  authenticatedView(userName: string, profilePath: string, logoutPath: ILogoutPath) {
    const { AvatarButton } = this.props
    return (
      <>
        <AvatarButton urlAvatar={this.state.avatar} profilePath={profilePath} logoutPath={logoutPath}>
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
    )
  }

  anonymousView(registerPath: string, loginPath: string) {
    return (
      <>
        <Button style={{ padding: 0 }}>
          <NavLink tag={Link} className="text-primary" to={loginPath}>
            <FontAwesomeIcon className="mr-1" icon={faSignInAlt} />
            Login
          </NavLink>
        </Button>
      </>
    )
  }
}
