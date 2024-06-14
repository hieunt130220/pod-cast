import * as types from "../../constant/store/auth";

export const loginReq = (email: string, password: string) => ({
  type: types.LOGIN_REQ,
  payload: {
    email,
    password,
  },
});

export const loginSuccess = (token: string) => ({
  type: types.LOGIN_SUCCESS,
  payload: {
    token,
  },
});

export const loginFailed = (message: string) => ({
  type: types.LOGIN_FAILED,
  payload: {
    message,
  },
});

export const logout = () => ({
  type: types.LOGOUT,
});
