export interface UserState {
  user: User;
  isloading: Boolean;
  isgoogle: Boolean;
}

export interface User {
  username: string;
  email: string;
  isGuest: boolean;
  // is_active: boolean,
  id: number | null;
}

export interface RegisterUser {
  email: string;
  password: string;
}

export interface RegisterUserInfo {
  detail: string;
}

export type RegisterUserResponse = RegisterUserInfo | RegisterUser;

export interface LoginUser {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  type: string;
}
