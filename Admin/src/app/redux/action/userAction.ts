import * as types from "../../constant/store/users";

export const getAllUsersReq = (token: string) => ({
  type: types.GET_ALL_USERS_REQ,
  payload: {
    token,
  },
});

export const getAllUsersSuccess = (data: types.usersType) => ({
  type: types.GET_ALL_USERS_SUCCESS,
  payload: {
    data,
  },
});

export const getAllUsersFailed = () => ({
  type: types.GET_ALL_USERS_FAILED,
});

export const getDetailUsersReq = (token: string, id: string) => ({
  type: types.GET_DETAIL_USERS_REQ,
  payload: {
    id,
    token,
  },
});

export const getDetailUsersSuccess = (detailUser: types.detailUserType) => ({
  type: types.GET_DETAIL_USERS_SUCCESS,
  payload: {
    detailUser,
  },
});

export const getDetailUsersFailed = () => ({
  type: types.GET_DETAIL_USERS_FAILED,
});

export const deleteAvatarUserReq = (token: string, id: string) => ({
  type: types.DELETE_USER_AVATAR_REQ,
  payload: {
    token,
    id,
  },
});

export const deleteAvatarUserSuccess = () => ({
  type: types.DELETE_USER_AVATAR_SUCCESS,
});
export const deleteAvatarUserFailed = () => ({
  type: types.DELETE_USER_AVATAR_FAILED,
});

export const searchUserByKeyword = (
  keyword: string,
  data: types.usersType
) => ({
  type: types.SEARCH_USER_BY_KEYWORD,
  payload: {
    keyword,
    data,
  },
});
