import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { podcastReducer } from "./podcastReducer";

const rootReducer = combineReducers({
  authReducer,
  userReducer,
  podcastReducer,
});

export default rootReducer;
