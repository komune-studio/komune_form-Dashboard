import ApiRequest from "../utils/ApiRequest";

export default class TopUp {
    static getAll = async () => {
        return await ApiRequest.set("v1/top-ups", "GET");
    }

    static create = async (body) => {
        return await ApiRequest.set("v1/top-up", "POST", body);
    }

    static edit = async (id, body) => {
        return await ApiRequest.set(`v1/top-up/${id}`, "PUT", body);
    }

    static getById = async (id, body) => {
        return await ApiRequest.set(`v1/top-up/${id}`, "GET", body);
    }

    static delete = async (id) => {
        return await ApiRequest.set(`v1/top-up/${id}`, "DELETE");
    }

    static restore = async (id) => {
        return await ApiRequest.set(`v1/top-up/${id}`, "PATCH");
    }

}
