import { PropsWithChildren } from "react";

export interface LoadingAppState {
  IsOpen: boolean;
  message?: string;
}
export interface LoadingDispatchProps {
  ChangeStatus: (state: LoadingAppState) => void;
}

export interface ILogoutPath {
  pathname: string;
  state: {
    local: boolean;
  };
}
export interface LogoutProps {
  action: string;
}
export interface LogoutState {
  message?: string;
  isReady: boolean;
  authenticated: boolean;
}

export interface AvatarProp {
  logoutPath?: ILogoutPath;
  profilePath?: string;
  urlAvatar?: string;
}
export interface ILoginMenuProps {
  AvatarButton: React.ComponentType<PropsWithChildren<AvatarProp>>;
}
export interface ILoginMenuState {
  isAuthenticated: boolean;
  userName?: string;
  avatar?: string;
}
export interface ILogoutPath {
  pathname: string;
  state: { local: boolean };
}
export interface LoginProps {
  action: string;
}
export interface LoginState {
  message?: string;
}
