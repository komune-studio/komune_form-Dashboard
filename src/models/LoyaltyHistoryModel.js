import ApiRequest from "../utils/ApiRequest";

export default class LoyaltyHistoryModel {
    static async getAll() {
        return await ApiRequest.set("v1/loyalty/usage/all", "GET")
    }

    static async create(body) {
        return await ApiRequest.set("v1/loyalty/usage/create", "POST", body)
    }
    
    static async addPoints(user_id, points) {
        return await ApiRequest.set("v1/loyalty/gain", "POST", {
            user_id, points
        })
    }
}