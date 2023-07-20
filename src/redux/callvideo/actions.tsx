const types = {
  SET_CALLER: "/video-call/caller",
  CALLER_SIGNAL: "/video-call/caller-signal",
  ROOM_ID: "video-call/room-id",
  USER_CALLING: "video-call/user-calling  ",
};
const action = {
  setCaller: (data: any) => {
    return {
      type: types.SET_CALLER,
      payload: { data },
    };
  },
  setCallerSignal: (data: any) => {
    return {
      type: types.CALLER_SIGNAL,
      payload: { data },
    };
  },
  setRoomId: (data: any) => {
    return {
      type: types.ROOM_ID,
      payload: { data },
    };
  },
  setUserCalling: (data: any) => {
    return {
      type: types.USER_CALLING,
      payload: { data },
    };
  },
};
const actions = {
  types,
  action,
};

export default actions;
export const VideoCallActions = action;
