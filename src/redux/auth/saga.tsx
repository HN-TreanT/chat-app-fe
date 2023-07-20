import { all, fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { notification } from "../../components/notification";
import stateActions from "../state/actions";
import actions from "./actions";
import { authServices } from "../../utils/services/authService";
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

function* saga_Redirect() {
  //action.type.
  let _navigate: Promise<any> = yield select((state: any) => state.state.navigate);
  let navigate: any = _navigate;
  if (navigate.navigate && navigate.path) {
    navigate.navigate(navigate.path);
  }
}

function* saga_loadFriends() {
  let _userInfo: Promise<any> = yield select((state: any) => state.auth.userInfo);
  let userInfo: any = _userInfo;
  let _valueSearchFriend: Promise<any> = yield select((state: any) => state.auth.valueSearchFriend);
  let valueSearchFriend: any = _valueSearchFriend;
  yield put(stateActions.action.loadingState(true));

  let _friends: Promise<any> = yield authServices.getFriends(
    userInfo._id,
    1,
    15,
    valueSearchFriend
  );
  let friends: any = _friends;
  yield put(actions.action.loadFriendSuccess(friends.data));
  yield put(stateActions.action.loadingState(false));
}

function* saga_loadUserInfo() {
  let _userInfo: Promise<any> = yield select((state: any) => state.auth.userInfo);
  let userInfo: any = _userInfo;
  yield put(stateActions.action.loadingState(true));
  let _me: Promise<any> = yield authServices.getByEmail(userInfo.email);
  let me: any = _me;
  yield put(stateActions.action.loadingState(false));
  if (me.status) {
    yield put(actions.action.setuserInfo(me.data));
  } else {
    yield put(actions.action.setuserInfo(userInfo));
  }
}
function* saga_RedirectAction() {
  yield saga_Redirect();
}
function* listen() {
  //  yield takeEvery(actions.types.LOAD_DATA, saga_loadData);
  yield takeEvery(actions.types.LOAD_FRIEND, saga_loadFriends);
  yield takeEvery(actions.types.LOAD_USER_INFO, saga_loadUserInfo);
}

export default function* mainSaga() {
  yield all([fork(listen)]);
}
