import { AuthActions } from "./auth/actions";
import { StateAction } from "./state/actions";
import { friendActions } from "./requestFriendly/actions";
import { VideoCallActions } from "./callvideo/actions";
const useAction = () => {
  const actions = { AuthActions, StateAction, friendActions, VideoCallActions };
  return actions;
};
export default useAction;
