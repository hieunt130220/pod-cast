import { AnyAction } from "redux-saga";
import * as types from "../../constant/store/auth";
import { cloneDeep } from "lodash";
import Cookies from "js-cookie";

export interface authReducerType {
  token: string;
  loading: boolean;
  message: string;
}

const initialState: authReducerType = {
  token: "",
  loading: false,
  message: "",
};

export const authReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case types.LOGIN_REQ: {
      const newState = cloneDeep(state);
      newState.loading = true;
      return newState;
    }
    case types.LOGIN_SUCCESS: {
      const newState = cloneDeep(state);
      const { token } = action.payload;
      newState.token = token;
      newState.loading = false;
      newState.message = "";
      return newState;
    }
    case types.LOGIN_FAILED: {
      const { message } = action.payload;
      const newState = cloneDeep(state);
      newState.message = message;
      newState.loading = false;
      return newState;
    }
    case types.LOGOUT: {
      const newState = cloneDeep(state);
      newState.token = "";
      Cookies.remove("accessToken");
      return newState;
    }
    default:
      return state;
  }
};
