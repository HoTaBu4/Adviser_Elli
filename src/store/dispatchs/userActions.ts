import store from "../store";
import { UserState } from "../types/UserType";

export const updateUser = (userData: Partial<UserState>) => {
  store.dispatch("user/updateUser", userData);
};
