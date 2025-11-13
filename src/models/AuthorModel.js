import ApiRequest from "utils/ApiRequest"

export default class Author {
  static getAll = async () => {
    return await ApiRequest.set("v1/authors/getall-authors", "GET")
  }

  static getById = async (id) => {
    return await ApiRequest.set(`v1/authors/getbyid/${id}`, "GET")
  }

  static getAllWithPagination = async (limit, page, keyword) => {
    return await ApiRequest.set(`v1/authors/search-authors-by-name-with-pagination-filter?limit=${limit}&page=${page}&keyword=${keyword}&sort_by`, "GET")
  }

  static create = async (body) => {
    return await ApiRequest.set("v1/authors/create-authors", "POST", body)
  }

  static edit = async (id, body) => {
    return await ApiRequest.set(`v1/authors/update-authors-byid/${id}`, "PUT", body)
  }

  static delete = async (id) => {
    return await ApiRequest.set(`v1/authors/delete/${id}`, "DELETE")
  }
}