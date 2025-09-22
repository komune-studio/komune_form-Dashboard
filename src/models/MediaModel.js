import ApiRequest from "utils/ApiRequest"

export default class Media {
  static getAll = async () => {
    return await ApiRequest.set("v1/medias/getall", "GET")
  }

  static getById = async (id) => {
    return await ApiRequest.set(`v1/medias/getbyid/${id}`, "GET")
  }

  static create = async (body) => {
    return await ApiRequest.set("v1/medias/create", "POST", body)
  }

  static edit = async (id, body) => {
    return await ApiRequest.set(`v1/medias/update/${id}`, "PUT", body)
  }

  static delete = async (id) => {
    return await ApiRequest.set(`v1/medias/delete/${id}`, "DELETE")
  }
}