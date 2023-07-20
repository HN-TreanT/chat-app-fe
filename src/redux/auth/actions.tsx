const types = {
  USER_INFO: "auth/user_info",
  LOAD_USER_INFO: "auth/load_user_info",
  LOAD_FRIEND: "auth/load_friend",
  LOAD_FRIEND_SUCCESS: "auth/load_friend_success",
  CONVERSATION: "auth/convertion",
  USER_SELECTED: "auth/user_selected",
  VALUE_SEARCH_FRIEND: "auth/value_search_friend",
};
const action = {
  setuserInfo: (data: any) => {
    return {
      type: types.USER_INFO,
      payload: { data },
    };
  },
  loadFriend: () => {
    return {
      type: types.LOAD_FRIEND,
    };
  },
  loadFriendSuccess: (data: any) => {
    return {
      type: types.LOAD_FRIEND_SUCCESS,
      payload: { data },
    };
  },
  setUserSelected: (data: any) => {
    return {
      type: types.USER_SELECTED,
      payload: { data },
    };
  },
  setConversation: (data: any) => {
    return {
      type: types.CONVERSATION,
      payload: { data },
    };
  },
  setValueSearchFriend: (data: any) => {
    return {
      type: types.VALUE_SEARCH_FRIEND,
      payload: { data },
    };
  },
  loadUserInfo: () => {
    return {
      type: types.LOAD_USER_INFO,
    };
  },
};
const actions = {
  types,
  action,
};

export default actions;
export const AuthActions = action;
