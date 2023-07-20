import { all } from "redux-saga/effects";

import authSaga from "./auth/saga";
import stateSaga from "./state/saga";
import friendSaga from "./requestFriendly/saga";
import videocallSaga from "./callvideo/saga";

export default function* rootSaga() {
  yield all([authSaga(), stateSaga(), friendSaga(), videocallSaga()]);
}
