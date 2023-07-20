import createApiService from "../createApiService";
const api = createApiService();

const getRequest = (page: any, pageSize: any) => {
  return api.makeRequest({
    url: `/api/request?page=${page}&pageSize=${pageSize}`,
    method: "GET",
  });
};

const createRequest = (data: any) => {
  return api.makeRequest({
    url: "/api/request/create",
    method: "POST",
    data: data,
  });
};

const deleteRequest = (id: any) => {
  return api.makeRequest({
    url: `/api/request/delete/?_id=${id}`,
    method: "DELETE",
  });
};

export const friendRequestServices = {
  getRequest,
  createRequest,
  deleteRequest,
};
