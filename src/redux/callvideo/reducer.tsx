import actions from "./actions";

const initAuth = {};
const VideoCallReducer = (state: any = initAuth, action: any) => {
  switch (action.type) {
    case actions.types.SET_CALLER:
      return {
        ...state,
        ...{
          caller: action.payload.data,
        },
      };
    case actions.types.CALLER_SIGNAL:
      return {
        ...state,
        ...{
          callerSignal: action.payload.data,
        },
      };
    case actions.types.ROOM_ID:
      return {
        ...state,
        ...{
          roomId: action.payload.data,
        },
      };
    case actions.types.USER_CALLING:
      return {
        ...state,
        ...{
          userCalling: action.payload.data,
        },
      };
    default:
      return state;
  }
};
export default VideoCallReducer;
