import ApiRequest from "../utils/ApiRequest";

export default class Book {
  static getAll = async () => {
    return await ApiRequest.set("v1/books/getall-books", "GET");
  } 

  static getAllWithFilter = async (category_id, keyword, limit, page) => {
    return await ApiRequest.set(`v1/books/getall-books-with-categories-filter-with-pagination?category_id=${category_id}&keyword=${keyword}&limit=${limit}&page=${page}`, "GET");
  } 

  static getById = async (id) => {
    return await ApiRequest.set(`v1/books/getbyid/${id}`, "GET");
  }

  static create = async (body) => {
    return await ApiRequest.set("v1/books/create-books", 'POST', body);
  }

  static edit = async (id, body) => {
    return await ApiRequest.set(`v1/books/update-books-byid/${id}`, "PUT", body);
  }
  
  static delete = async (id) => {
    return await ApiRequest.set(`v1/books/delete/${id}`, "DELETE");
  }
}