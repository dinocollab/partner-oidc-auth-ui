import React, { ComponentType } from 'react'
import { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { ApplicationPaths, QueryParameterNames } from 'partner-oidc-auth'
import { authService } from 'partner-oidc-auth'

export interface AuthorizeRouteProps {
  path: string | string[]
  component: ComponentType<any>
  roles?: string[][]
}
interface AuthorizeRouteState {
  ready: boolean
  authenticated: boolean
  roles: string[]
}
export interface IAuthorizeRouteContext {
  state: AuthorizeRouteState
}
export const AuthorizeRouteContext = React.createContext<IAuthorizeRouteContext>({} as any)
export class AuthorizeRoute extends Component<AuthorizeRouteProps, AuthorizeRouteState> {
  constructor(props: AuthorizeRouteProps) {
    super(props)

    this.state = {
      ready: false,
      authenticated: false,
      roles: [],
    }
  }
  _subscription?: number
  componentDidMount() {
    this._subscription = authService.subscribe(() => this.authenticationChanged())
    this.populateAuthenticationState()
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription ?? 0)
  }

  render() {
    const { ready, authenticated } = this.state
    const link = document.createElement('a')
    link.href = Array.isArray(this.props.path) ? this.props.path[0] : this.props.path
    const returnUrl = `${ApplicationPaths.Origin()}${link.pathname}${link.search}${link.hash}`
    const redirectUrl = `${ApplicationPaths.Login}?${QueryParameterNames.ReturnUrl}=${encodeURIComponent(returnUrl)}`
    if (!ready) {
      return <div></div>
    } else {
      const { component: Component, ...rest } = this.props
      return (
        <AuthorizeRouteContext.Provider value={this}>
          <Route
            {...rest}
            render={(props) => {
              if (!authenticated) {
                return <Redirect to={redirectUrl} />
              }
              if (
                this.props.roles &&
                !this.props.roles.every(k=>k.some((x) => this.state.roles.some((y) => y.toLowerCase() === x.toLowerCase())))
              ) {
                return <Redirect to={ApplicationPaths.AccessDenied} />
              } else {
                return <Component {...props} roles={this.state.roles} />
              }
            }}
          />
        </AuthorizeRouteContext.Provider>
      )
    }
  }
  navigateToReturnUrl(returnUrl: string) {
    // It's important that we do a replace here so that we remove the callback uri with the
    // fragment containing the tokens from the browser history.
    window.location.replace(returnUrl)
  }
  async populateAuthenticationState() {
    const [authenticated, roles] = await Promise.all([authService.isAuthenticated(), authService.getRoles()])
    this.setState({ ready: true, authenticated, roles: roles ?? [] })
  }

  async authenticationChanged() {
    this.setState({ ready: false, authenticated: false })
    await this.populateAuthenticationState()
  }
}
