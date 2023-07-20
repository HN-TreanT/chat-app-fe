import createApiService from "../createApiService";
const api = createApiService();

const handleLogin = (loginInfo: any) => {
  return api.makeRequest({
    url: "/api/user/login",
    method: "POST",
    data: loginInfo,
  });
};
const handleRegister = (data: any) => {
  return api.makeRequest({
    url: "/api/user/register",
    method: "POST",
    data,
  });
};

const getAll = (page: any, pageSize: any) => {
  return api.makeRequest({
    url: `/api/user?page=${page}&pageSize=${pageSize}`,
    method: "GET",
  });
};

const editUser = (data: any) => {
  return api.makeRequest({
    url: `/api/user/${data.id}`,
    method: "PUT",
    data: data,
  });
};

const getByEmail = (email: any) => {
  return api.makeRequest({
    url: `/api/user/${email}`,
    method: "GET",
  });
};
const getFriends = (id: any, page: any, pageSize: any, search: any) => {
  return api.makeRequest({
    url: `/api/user/getfriend/listFriend?id=${id}&page=${page}&pageSize=${pageSize}&search=${search}`,
    method: "GET",
  });
};

const loginwithGGorFB = (data: any) => {
  return api.makeRequest({
    url: "/api/auth/login-gg-fb",
    method: "POST",
    data: data,
  });
};

export const authServices = {
  handleLogin,
  handleRegister,
  getAll,
  getByEmail,
  getFriends,
  loginwithGGorFB,
  editUser,
};
