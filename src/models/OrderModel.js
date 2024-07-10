import ApiRequest from "../utils/ApiRequest";

export default class OrderModel {
    static getAllBarcoinUsages = async () => {
        return await ApiRequest.set("v1/barcoin/usage/all", "GET");
    }
    
    static createBarcoinUsage = async (body) => {
        return await ApiRequest.set("v1/barcoin/usage/create", "POST", body);
    }

    static createBarcoinUsageV2 = async (body) => {
        return await ApiRequest.set('v2/barcoin/usage/create', 'POST', body);
    }

    static getAllRidesUsages = async () => {
        return await ApiRequest.set('v1/rides', 'GET');
    }

    static createRidesUsage = async (body) => {
        return await ApiRequest.set('v1/rides', 'POST', body);
    }
}