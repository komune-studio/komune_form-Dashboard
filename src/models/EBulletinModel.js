import ApiRequest from "utils/ApiRequest"

export default class EBulletin {
  static getAll = async () => {
    return await ApiRequest.set("v1/e-bulletins/getall", "GET")
  }

  static getById = async (id) => {
    return await ApiRequest.set(`v1/e-bulletin/getbyid/${id}`, "GET")
  }

  static create = async (body) => {
    return await ApiRequest.set("v1/e-bulletin/create", "POST", body)
  }

  static edit = async (id, body) => {
    return await ApiRequest.set(`v1/e-bulletin/update/${id}`, "PUT", body)
  }

  static delete = async (id) => {
    return await ApiRequest.set(`v1/e-bulletin/delete/${id}`, "DELETE")
  }
}