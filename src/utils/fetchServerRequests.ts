import axios from "axios";

export const fetchGetRequestsWithPagination = async (
  url: string,
  page?: any,
  limit?: any
) => {
  const response = await axios.get(url, {
    params: { page: page, limit: limit },
  });
  return response.data.result;
};

export const fetchGetRequests = async (url: string) => {
  let response: any;
  let error;
  await axios
    .get(url)
    .then((res) => {
      response = res.data;
    })
    .catch((err) => {
      error = err.response.data.statusCode;
    });
  return { response, error };
};

export const fetchDeleteRequests = async (url: string) => {
  const response = await axios.delete(url);
  return response.data.data;
};
