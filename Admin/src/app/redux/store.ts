import rootReducer from "./reducer/reducer";
import rootSaga from "./saga/saga";
import createSagaMiddleware from "redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import Cookies from "js-cookie";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));

const tokenFromCookies = Cookies.get("accessToken")
  ? Cookies.get("accessToken")
  : "";

const initialState = {
  authReducer: {
    token: tokenFromCookies,
  },
} as {};

const store = createStore(rootReducer, initialState, enhancer);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
