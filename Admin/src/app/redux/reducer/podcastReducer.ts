import { AnyAction } from "redux-saga";
import * as types from "../../constant/store/podcast";
import { cloneDeep } from "lodash";
import { toLowerCaseNonAccentVietnamese } from "../../utils/string";

export interface podcastReducerType {
  loading: boolean;
  loadingDetailPodcast: boolean;
  dataPodcast: types.podcastType[];
  detailPodcast: types.podcastType | null;
}

const initialState: podcastReducerType = {
  loading: false,
  dataPodcast: [],
  loadingDetailPodcast: false,
  detailPodcast: null,
};

export const podcastReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case types.GET_ALL_PODCASTS_REQ: {
      const newState = cloneDeep(state);
      newState.loading = true;
      return newState;
    }
    case types.GET_DETAIL_PODCAST_REQ: {
      const newState = cloneDeep(state);
      newState.loadingDetailPodcast = true;
      return newState;
    }
    case types.GET_ALL_PODCASTS_SUCCESS: {
      const newState = cloneDeep(state);
      const { data } = action.payload;
      newState.loading = false;
      newState.dataPodcast = cloneDeep(data);
      return newState;
    }
    case types.GET_DETAIL_PODCAST_SUCCESS: {
      const newState = cloneDeep(state);
      const { data } = action.payload;
      newState.loadingDetailPodcast = false;
      newState.detailPodcast = data;
      return newState;
    }
    case types.GET_ALL_PODCASTS_FAILED: {
      const newState = cloneDeep(state);
      newState.loading = false;
      return newState;
    }
    case types.GET_DETAIL_PODCAST_FAILED: {
      const newState = cloneDeep(state);
      newState.loadingDetailPodcast = false;
      return newState;
    }
    case types.SEARCH_PODCAST_BY_KEYWORD: {
      const { keyword, data } = action.payload;
      const rowsSearch = keyword
        ? data.filter((row: types.podcastType) =>
            toLowerCaseNonAccentVietnamese(row.caption)?.includes(keyword)
          )
        : data;
      return {
        ...state,
        dataPodcast: rowsSearch,
      };
    }
    default:
      return state;
  }
};
