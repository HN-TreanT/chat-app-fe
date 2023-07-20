import createApiService from "../createApiService";
const api = createApiService();

const getMessages = (id: any, page: any, pageSize: any) => {
  return api.makeRequest({
    url: `/api/messages?id=${id}&page=${page}&pageSize=${pageSize}`,
    method: "GET",
  });
};

export const messageService = {
  getMessages,
};
