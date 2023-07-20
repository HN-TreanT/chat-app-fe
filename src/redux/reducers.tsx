import AuthReducer from "./auth/reducer";
import StateReducer from "./state/reducer";
import FriendReducer from "./requestFriendly/reducer";
import VideoCallReducer from "./callvideo/reducer";

const rootReducer = {
  auth: AuthReducer,
  state: StateReducer,
  friend: FriendReducer,
  videocall: VideoCallReducer,
};

export default rootReducer;
