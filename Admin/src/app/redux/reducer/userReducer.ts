import { cloneDeep } from "lodash";
import * as types from "../../constant/store/users";
import { AnyAction } from "redux-saga";
import { toLowerCaseNonAccentVietnamese } from "../../utils/string";

export interface userReducerType {
  loading: boolean;
  loadingUserDetail: boolean;
  dataUser: types.usersType[];
  dataUserDetail: types.detailUserType | null;
  loadingDeleteAvt: boolean;
}

const initialState: userReducerType = {
  loading: false,
  dataUser: [],
  dataUserDetail: null,
  loadingUserDetail: false,
  loadingDeleteAvt: false,
};

export const userReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case types.GET_ALL_USERS_REQ: {
      const newState = cloneDeep(state);
      newState.loading = true;
      return newState;
    }
    case types.GET_DETAIL_USERS_REQ: {
      const newState = cloneDeep(state);
      newState.loadingUserDetail = true;
      return newState;
    }
    case types.DELETE_USER_AVATAR_REQ: {
      const newState = cloneDeep(state);
      newState.loadingDeleteAvt = true;
      return newState;
    }
    case types.GET_ALL_USERS_SUCCESS: {
      const newState = cloneDeep(state);
      const { data } = action.payload;
      newState.loading = false;
      newState.dataUser = cloneDeep(data);
      return newState;
    }
    case types.GET_DETAIL_USERS_SUCCESS: {
      const newState = cloneDeep(state);
      const { detailUser } = action.payload;
      newState.loadingUserDetail = false;
      newState.dataUserDetail = cloneDeep(detailUser);
      return newState;
    }
    case types.DELETE_USER_AVATAR_SUCCESS: {
      const newState = cloneDeep(state);
      newState.loadingDeleteAvt = false;
      return newState;
    }
    case types.GET_ALL_USERS_FAILED: {
      const newState = cloneDeep(state);
      newState.loading = false;
      return newState;
    }
    case types.GET_DETAIL_USERS_FAILED: {
      const newState = cloneDeep(state);
      newState.loadingUserDetail = false;
      return newState;
    }
    case types.DELETE_USER_AVATAR_FAILED: {
      const newState = cloneDeep(state);
      newState.loadingDeleteAvt = false;
      return newState;
    }
    case types.SEARCH_USER_BY_KEYWORD: {
      const { keyword, data } = action.payload;
      const newState = cloneDeep(state);
      const rowsSearch = keyword
        ? data.filter((row: types.usersType) =>
            toLowerCaseNonAccentVietnamese(row.username)?.includes(keyword)
          )
        : data;
      newState.dataUser = cloneDeep(rowsSearch);
      return newState;
    }
    default:
      return state;
  }
};
