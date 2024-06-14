import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import {
  getAllPodcastsApi,
  getDetailPodcastsApi,
} from "../../apis/podcast.api";
import * as actions from "../action/podcastAction";
import * as types from "../../constant/store/podcast";

export const podcastsSagas = function* ({
  payload,
}: types.PodcastAction): SagaIterator {
  try {
    const { token } = payload;
    const response = yield call(getAllPodcastsApi, token);
    if (response.status === 200) {
      yield put(actions.getAllPodcastsSuccess(response.data.data));
    } else {
      yield put(actions.getAllPodcastsFailed());
    }
  } catch (error: any) {
    // error.response.data.message
    yield put(actions.getAllPodcastsFailed());
  }
};

export const detailPodcastSagas = function* ({
  payload,
}: types.PodcastAction): SagaIterator {
  try {
    const { token, id } = payload;
    const response = yield call(getDetailPodcastsApi, token, id);
    if (response.status === 200) {
      yield put(actions.getDetailPodcastSuccess(response.data.data));
    } else {
      yield put(actions.getDetailPodcastFailed());
    }
  } catch (error: any) {
    // error.response.data.message
    yield put(actions.getDetailPodcastFailed());
  }
};

export function* watchPodcastAsync() {
  yield takeEvery(types.GET_ALL_PODCASTS_REQ, podcastsSagas);
  yield takeEvery(types.GET_DETAIL_PODCAST_REQ, detailPodcastSagas);
}
