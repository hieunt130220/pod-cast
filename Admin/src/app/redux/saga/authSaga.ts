import { call, put, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import * as actions from "../action/authAction";
import * as types from "../../constant/store/auth";
import { loginAdminApi } from "../../apis/auth.api";

interface LoginAction {
  type: string;
  payload: {
    email: string;
    password: string;
  };
}

export const LoginSagas = function* ({ payload }: LoginAction): SagaIterator {
  try {
    const { email, password } = payload;
    const response = yield call(loginAdminApi, email, password);
    if (response.data.status_code === 200) {
      const { token } = response.data.data;
      yield put(actions.loginSuccess(token));
    } else {
      yield put(actions.loginFailed(response.data.message));
    }
  } catch (error: any) {
    yield put(actions.loginFailed(error.response.data.message));
  }
};

export function* watchLoginAsync() {
  yield takeEvery(types.LOGIN_REQ, LoginSagas);
}
