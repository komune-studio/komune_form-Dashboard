import ApiRequest from "utils/ApiRequest"

export default class News {
  static getAll = async () => {
    return await ApiRequest.set("v1/news/getallnews", "GET")
  }

  static getById = async (id) => {
    return await ApiRequest.set(`v1/news/getbyid/${id}`, "GET")
  }

  static getAllWithPagination = async (limit, page, keyword) => {
    return await ApiRequest.set(`v1/news/get-with-pagination?page=${page}&limit=${limit}&sort_by=created_at&sort_type=asc&keyword=${keyword}`, "GET")
  }

  static create = async (body) => {
    return await ApiRequest.set("v1/news/create", "POST", body)
  }

  static edit = async (id, body) => {
    return await ApiRequest.set(`v1/news/update/${id}`, "PUT", body)
  }

  static delete = async (id) => {
    return await ApiRequest.set(`v1/news/delete/${id}`, "DELETE")
  }
}