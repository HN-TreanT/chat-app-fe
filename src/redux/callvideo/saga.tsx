import { all, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { notification } from "../../components/notification";
import stateActions from "../state/actions";
import actions from "./actions";
import { authServices } from "../../utils/services/authService";

function* listen() {
  //  yield takeEvery(actions.types.LOAD_DATA, saga_loadData);
}

export default function* mainSaga() {
  yield all([fork(listen)]);
}
