import actions from "./actions";
const initState = {
  loginState: false,
  loadingState: false,
  loadingFriend: false,
  conversationORsidebar: "sidebar",
};
const StateReducer = (state: any = initState, action: any) => {
  switch (action.type) {
    case actions.types.IS_LOADING:
      return {
        ...state,
        ...{
          loadingState: action.payload.isLoading,
        },
      };
    case actions.types.IS_lOGIN:
      return {
        ...state,
        ...{
          loginState: action.payload.isLogin,
        },
      };
    case actions.types.IS_SELECTED_MENU_ITEM:
      return {
        ...state,
        ...{
          isSelectedMenuItem: action.payload.isSelected,
        },
      };
    case actions.types.KEYS_OPEN:
      return {
        ...state,
        ...{
          keys: action.payload.keys,
        },
      };
    case actions.types.SET_NAVIGATE:
      return {
        ...state,
        ...{
          navigate: action.payload.data,
        },
      };
    case actions.types.REDIRECT_ACTION:
      return {
        ...state,
      };
    case actions.types.INIT_SOCKET:
      return {
        ...state,
        socket: action.payload.socket,
      };
    case actions.types.ACCEPT_CALL:
      return {
        ...state,
        ...{
          acceptCall: action.payload.data,
        },
      };
    case actions.types.LOADING_FRIEND:
      return {
        ...state,
        ...{
          loadingFriend: action.payload.data,
        },
      };
    case actions.types.SPAN:
      return {
        ...state,
        ...{
          span: action.payload.data,
        },
      };
    case actions.types.CONVERSATION_OR_SIDEBAR:
      return {
        ...state,
        ...{
          conversationORsidebar: action.payload.data,
        },
      };
    default:
      return state;
  }
};

export default StateReducer;
