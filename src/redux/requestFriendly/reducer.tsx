import actions from "./actions";

const initAuth = {
  listRequest: {},
};
const FriendReducer = (state: any = initAuth, action: any) => {
  switch (action.type) {
    case actions.types.LOAD_DATA:
      return {
        ...state,
      };
    case actions.types.LOAD_DATA_SUCCESS:
      return {
        ...state,
        ...{
          listRequest: action.payload.data,
        },
      };
    default:
      return state;
  }
};
export default FriendReducer;
