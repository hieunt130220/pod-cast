import { SagaIterator } from "redux-saga";
import { call, put, takeEvery } from "redux-saga/effects";
import * as types from "../../constant/store/users";
import * as actions from "../action/userAction";
import {
  deleteAvatarApi,
  getAllUsersApi,
  getDetailUserApi,
} from "../../apis/user.api";

export const usersSagas = function* ({
  payload,
}: types.UserAction): SagaIterator {
  try {
    const { token } = payload;
    const response = yield call(getAllUsersApi, token);
    if (response.status === 200) {
      yield put(actions.getAllUsersSuccess(response.data.data));
    } else {
      yield put(actions.getAllUsersFailed());
    }
  } catch (error: any) {
    // error.response.data.message
    yield put(actions.getAllUsersFailed());
  }
};

export const detailUserSagas = function* ({
  payload,
}: types.DetailUserAction): SagaIterator {
  try {
    const { token, id } = payload;
    const response = yield call(getDetailUserApi, token, id);
    if (response.status === 200) {
      yield put(actions.getDetailUsersSuccess(response.data.data));
    } else {
      yield put(actions.getDetailUsersFailed());
    }
  } catch (error: any) {
    // error.response.data.message
    yield put(actions.getDetailUsersFailed());
  }
};

export const deleteAvatarUserSagas = function* ({
  payload,
}: types.DetailUserAction): SagaIterator {
  try {
    const { token, id } = payload;
    const response = yield call(deleteAvatarApi, token, id);
    if (response.status === 200) {
      yield put(actions.deleteAvatarUserSuccess());
    } else {
      yield put(actions.deleteAvatarUserFailed());
    }
  } catch (error: any) {
    // error.response.data.message
    yield put(actions.deleteAvatarUserFailed());
  }
};

export function* watchUserAsync() {
  yield takeEvery(types.GET_ALL_USERS_REQ, usersSagas);
  yield takeEvery(types.GET_DETAIL_USERS_REQ, detailUserSagas);
  yield takeEvery(types.DELETE_USER_AVATAR_REQ, deleteAvatarUserSagas);
}
