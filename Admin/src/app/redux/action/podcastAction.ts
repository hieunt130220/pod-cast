import * as types from "../../constant/store/podcast";

export const getAllPodcastsReq = (token: string) => ({
  type: types.GET_ALL_PODCASTS_REQ,
  payload: {
    token,
  },
});

export const getAllPodcastsSuccess = (data: types.podcastType[]) => ({
  type: types.GET_ALL_PODCASTS_SUCCESS,
  payload: {
    data,
  },
});

export const getAllPodcastsFailed = () => ({
  type: types.GET_ALL_PODCASTS_FAILED,
});

export const getDetailPodcastReq = (token: string, id: string) => ({
  type: types.GET_DETAIL_PODCAST_REQ,
  payload: {
    token,
    id,
  },
});

export const getDetailPodcastSuccess = (data: types.podcastType) => ({
  type: types.GET_DETAIL_PODCAST_SUCCESS,
  payload: {
    data,
  },
});

export const getDetailPodcastFailed = () => ({
  type: types.GET_DETAIL_PODCAST_FAILED,
});

export const searchPodcastByKeyword = (
  keyword: string,
  data: types.podcastType
) => ({
  type: types.SEARCH_PODCAST_BY_KEYWORD,
  payload: {
    keyword,
    data,
  },
});
