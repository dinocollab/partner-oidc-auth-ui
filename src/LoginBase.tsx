import React, { Component } from 'react'
import { authService, AuthenticationResultStatus, LoginActions, QueryParameterNames, ApplicationPaths } from 'partner-oidc-auth'
import { LoadingDispatchProps, LoginProps, LoginState } from './type'

// The main responsibility of this component is to handle the user's login process.
// This is the starting point for the login process. Any component that needs to authenticate
// a user can simply perform a redirect to this component with a returnUrl query parameter and
// let the component perform the login and return back to the return url.

type _LoginBaseProps = LoadingDispatchProps & LoginProps

export class LoginBase extends Component<_LoginBaseProps, LoginState> {
  constructor(props: _LoginBaseProps) {
    super(props)

    this.state = {
      message: undefined,
    }
  }

  componentDidMount() {
    const action = this.props.action
    switch (action) {
      case LoginActions.Login:
        this.props.ChangeStatus({
          IsOpen: true,
          message: 'Processing login',
        })
        this.login(this.getReturnUrl())
        break
      case LoginActions.LoginCallback:
        this.props.ChangeStatus({
          IsOpen: true,
          message: 'Processing login callback',
        })
        this.processLoginCallback()
        break
      case LoginActions.LoginFailed:
        const params = new URLSearchParams(window.location.search)
        const error = params.get(QueryParameterNames.Message) ?? undefined
        this.setState({ message: error })
        break
      case LoginActions.Profile:
        this.redirectToProfile()
        break
      case LoginActions.AccessDenied:
        this.redirectToAccessDenied()
        break
      case LoginActions.Register:
        this.redirectToRegister()
        break
      default:
        throw new Error(`Invalid action '${action}'`)
    }
  }
  render() {
    const action = this.props.action
    const { message } = this.state

    if (message) {
      return <div>{message}</div>
    } else {
      switch (action) {
        case LoginActions.Login: {
          return <div></div>
        }
        case LoginActions.LoginCallback: {
          return <div></div>
        }
        case LoginActions.AccessDenied:
          return <div>AccessDenied</div>
        // return <div>Processing login callback</div>;
        case LoginActions.Profile:
        case LoginActions.Register:
          return <div></div>
        default:
          throw new Error(`Invalid action '${action}'`)
      }
    }
  }

  async login(returnUrl: string) {
    const state = { returnUrl }
    const result = await authService.signIn(state)

    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        break
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(returnUrl)
        break
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result.message })
        break
      default:
        throw new Error(`Invalid status result ${result.status}.`)
    }
  }

  async processLoginCallback() {
    const url = window.location.href
    const result = await authService.completeSignIn(url)
    switch (result.status) {
      case AuthenticationResultStatus.Redirect:
        // There should not be any redirects as the only time completeSignIn finishes
        // is when we are doing a redirect sign in flow.
        throw new Error('Should not redirect.')
      case AuthenticationResultStatus.Success:
        await this.navigateToReturnUrl(this.getReturnUrl(result.state))
        break
      case AuthenticationResultStatus.Fail:
        this.setState({ message: result.message })
        break
      default:
        throw new Error(`Invalid authentication result status '${result.status}'.`)
    }
  }

  getReturnUrl(state?: any) {
    const params = new URLSearchParams(window.location.search)
    const fromQuery = params.get(QueryParameterNames.ReturnUrl)
    if (fromQuery && !fromQuery.startsWith(`${ApplicationPaths.Origin()}/`)) {
      // This is an extra check to prevent open redirects.
      throw new Error('Invalid return url. The return url needs to have the same origin as the current page.')
    }
    return (state && state.returnUrl) || fromQuery || `${ApplicationPaths.Origin()}/`
  }

  redirectToRegister() {
    this.redirectToApiAuthorizationPath(
      `${ApplicationPaths.IdentityRegisterPath}?${QueryParameterNames.ReturnUrl}=${encodeURI(ApplicationPaths.Login)}`
    )
  }

  redirectToProfile() {
    this.redirectToApiAuthorizationPath(ApplicationPaths.IdentityManagePath)
  }
  redirectToAccessDenied() {
    window.location.replace(`${ApplicationPaths.Origin('')}${ApplicationPaths.IdentityAccessDenied}`)
  }
  redirectToApiAuthorizationPath(apiAuthorizationPath: string) {
    const redirectUrl = `${ApplicationPaths.Origin('')}/${apiAuthorizationPath}`
    // It's important that we do a replace here so that when the user hits the back arrow on the
    // browser they get sent back to where it was on the app instead of to an endpoint on this
    // component.
    window.location.replace(redirectUrl)
  }

  navigateToReturnUrl(returnUrl: string) {
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    window.location.replace(returnUrl)
  }
}
