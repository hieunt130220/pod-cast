import { podcastType } from "./podcast";

export const GET_ALL_USERS_REQ = "GET_ALL_USERS_REQ";
export const GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS";
export const GET_ALL_USERS_FAILED = "GET_ALL_USERS_FAILED";

export const GET_DETAIL_USERS_REQ = "GET_DETAIL_USERS_REQ";
export const GET_DETAIL_USERS_SUCCESS = "GET_DETAIL_USERS_SUCCESS";
export const GET_DETAIL_USERS_FAILED = "GET_DETAIL_USERS_FAILED";

export const DELETE_USER_AVATAR_REQ = "DELETE_USER_AVATAR_REQ";
export const DELETE_USER_AVATAR_SUCCESS = "DELETE_USER_AVATAR_SUCCESS";
export const DELETE_USER_AVATAR_FAILED = "DELETE_USER_AVATAR_FAILED";

export const SEARCH_USER_BY_KEYWORD = "SEARCH_USER_BY_KEYWORD";

export interface usersType {
  _id: string;
  username: string;
  avatar: string;
}

export interface detailUserType {
  user: usersType;
  podcasts: podcastType[];
}

export interface UserAction {
  type: string;
  payload: {
    token: string;
  };
}

export interface DetailUserAction {
  type: string;
  payload: {
    token: string;
    id: string;
  };
}
