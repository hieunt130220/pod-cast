import { all } from "redux-saga/effects";
import { watchLoginAsync } from "./authSaga";
import { watchUserAsync } from "./userSaga";
import { watchPodcastAsync } from "./podcastSaga";

export default function* rootSaga() {
  yield all([watchLoginAsync(), watchUserAsync(), watchPodcastAsync()]);
}
