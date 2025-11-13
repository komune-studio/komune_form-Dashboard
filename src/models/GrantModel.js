import ApiRequest from "../utils/ApiRequest";

export default class Grant {
  static getAll = async () => {
    return await ApiRequest.set("v1/grants/get-all", "GET");
  }

  static searchByStatusAndPagination = async ( keyword, limit, page, status) => {
    return await ApiRequest.set(`v1/grants/search-by-status-with-pagination?keyword=${keyword}&limit=${limit}&page=${page}&status=${status}`, "GET");
  } 

  static approveGrant = async (id) => {
    return await ApiRequest.set(`v1/grants/approve-grant-by-id/${id}`, "PUT");
  }

  static rejectGrant = async (id, body) => {
    return await ApiRequest.set(`v1/grants/reject-grant-by-id/${id}`, "PUT", body);
  }

  static edit = async (id, body) => {
    return await ApiRequest.set(`v1/user/profile/${id}`, "PUT", body);
  }

  static delete = async (id) => {
    return await ApiRequest.set(`v1/user/${id}`, "DELETE");
  }
}
