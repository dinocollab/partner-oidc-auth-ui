import React, { Component } from 'react'
import { Route } from 'react-router'
import { ApplicationPaths, LoginActions, LogoutActions } from 'partner-oidc-auth'

/**
 *function this.props.loginAction(name: string) {
 *   return <Login action={name}></Login>;
 * }
 * function this.props.logoutAction(name: string) {
 *   return <Logout action={name}></Logout>;
 * }
 */
export class ApiAuthorizationRoutesBase extends Component {
  loginAction = (name: string): JSX.Element => <div>{name}</div>
  logoutAction = (name: string): JSX.Element => <div>{name}</div>
  render() {
    return (
      <>
        <Route path={ApplicationPaths.Login} render={() => this.loginAction(LoginActions.Login)} />
        <Route path={ApplicationPaths.LoginFailed} render={() => this.loginAction(LoginActions.LoginFailed)} />
        <Route path={ApplicationPaths.LoginCallback} render={() => this.loginAction(LoginActions.LoginCallback)} />
        <Route path={ApplicationPaths.Profile} render={() => this.loginAction(LoginActions.Profile)} />
        <Route path={ApplicationPaths.AccessDenied} render={() => this.loginAction(LoginActions.AccessDenied)} />
        <Route path={ApplicationPaths.Register} render={() => this.loginAction(LoginActions.Register)} />
        {/* <Route
          path={ApplicationPaths.AccessDenied}
          render={() => this.loginAction(LoginActions.AccessDenied)}
        /> */}
        <Route path={ApplicationPaths.LogOut} render={() => this.logoutAction(LogoutActions.Logout)} />
        <Route path={ApplicationPaths.LogOutCallback} render={() => this.logoutAction(LogoutActions.LogoutCallback)} />
        <Route path={ApplicationPaths.LoggedOut} render={() => this.logoutAction(LogoutActions.LoggedOut)} />
      </>
    )
  }
}
