import { User } from "../../assets/types/user";
import { LoginResponse, RegisterUser } from "../../store/types/UserType";
import { client } from "../fetchClient";
export const loginUser = (data: Omit<User, "username">) => {
  return client.post<LoginResponse | {detail: string} | void>("/user/token/", data);
};

export const registerUser = (data: User) => {
  return client.post<RegisterUser>("/auth/user/", data);
};

export const logOutUser = () => {
  return client.get("/user/logout");
};

export const userLogout = () => {
  return client.get("/user/logout");
};
export const authWithGoogle = () => {
  return client.get("/auth/google/");
};
