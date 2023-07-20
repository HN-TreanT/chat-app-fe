const types = {
  LOAD_DATA: "/friendly/load_data",
  LOAD_DATA_SUCCESS: "/friendly/load_data_success",
};
const action = {
  loadData: () => {
    return {
      type: types.LOAD_DATA,
    };
  },
  loadDataSuccess: (data: any) => {
    return {
      type: types.LOAD_DATA_SUCCESS,
      payload: { data },
    };
  },
};
const actions = {
  types,
  action,
};

export default actions;
export const friendActions = action;
