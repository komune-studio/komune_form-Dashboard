import ApiRequest from "../utils/ApiRequest";

export default class OrderModel {
    static getAll = async () => {
        return await ApiRequest.set("v1/barcoin/usage/all", "GET");
    }
    static create = async (body) => {
        return await ApiRequest.set("v1/barcoin/usage/create", "POST", body);
    }

    static createV2 = async (body) => {
        return await ApiRequest.set('v2/barcoin/usage/create', 'POST', body);
    }

}