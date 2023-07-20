import { all, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { notification } from "../../components/notification";
import stateActions from "../state/actions";
import { friendRequestServices } from "../../utils/services/FriendRequest";
import actions from "./actions";
function* handleFail(message: any) {
  yield put(stateActions.action.loadingState(false));
  notification({
    message: message,
    title: "Thông báo",
    position: "top-right",
    type: "danger",
  });
}

function* handleErr(err: any) {
  yield put(stateActions.action.loadingState(false));
  notification({
    message: err.message,
    title: "Thông báo",
    position: "top-right",
    type: "danger",
  });
}

function* loadData() {
  try {
    yield put(stateActions.action.loadingState(true));
    let _request: Promise<any> = yield friendRequestServices.getRequest(1, 5);
    let request: any = _request;
    if (request.status) {
      yield put(actions.action.loadDataSuccess(request.data));
    } else {
      yield put(actions.action.loadDataSuccess([]));
    }
    yield put(stateActions.action.loadingState(false));
  } catch (err: any) {
    console.log(err);
  }
}

function* saga_Redirect() {
  //action.type.
  let _navigate: Promise<any> = yield select((state: any) => state.state.navigate);
  let navigate: any = _navigate;
  if (navigate.navigate && navigate.path) {
    navigate.navigate(navigate.path);
  }
}

function* saga_RedirectAction() {
  yield saga_Redirect();
}
function* listen() {
  //  yield takeEvery(actions.types.LOAD_DATA, saga_loadData);
  yield takeEvery(actions.types.LOAD_DATA, loadData);
}

export default function* mainSaga() {
  yield all([fork(listen)]);
}
