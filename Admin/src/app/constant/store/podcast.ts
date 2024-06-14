import { usersType } from "./users";

export const GET_ALL_PODCASTS_REQ = "GET_ALL_PODCASTS_REQ";
export const GET_ALL_PODCASTS_SUCCESS = "GET_ALL_PODCASTS_SUCCESS";
export const GET_ALL_PODCASTS_FAILED = "GET_ALL_PODCASTS_FAILED";

export const GET_DETAIL_PODCAST_REQ = "GET_DETAIL_PODCAST_REQ";
export const GET_DETAIL_PODCAST_SUCCESS = "GET_DETAIL_PODCAST_SUCCESS";
export const GET_DETAIL_PODCAST_FAILED = "GET_DETAIL_PODCAST_FAILED";

export const SEARCH_PODCAST_BY_KEYWORD = "SEARCH_PODCAST_BY_KEYWORD";

export interface commentType {
  user: usersType;
  text: string;
  date: string;
  _id: string;
}

export interface podcastType {
  _id: string;
  audio: string;
  background: string;
  caption: string;
  likes: string[];
  uploadDate: Date;
  comments: commentType[];
  user: usersType;
}

export interface PodcastAction {
  type: string;
  payload: {
    token: string;
    id: string;
  };
}
