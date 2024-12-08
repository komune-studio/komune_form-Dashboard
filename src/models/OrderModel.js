import ApiRequest from "../utils/ApiRequest";
import moment from "moment/moment";

export default class OrderModel {
    static getAllBarcoinUsages = async (startDate, endDate) => {
        let formattedStartDate = moment(startDate, "YYYY-MM-DD").set({hour : 0, minute : 0, second : 0}).toDate()
        let formattedEndDate = moment(endDate, "YYYY-MM-DD").set({hour : 23, minute : 59, second : 59}).toDate()

        return await ApiRequest.set(`v1/barcoin/usage/filter?start_date=${formattedStartDate}&end_date=${formattedEndDate}`, "GET");
    }

    static createBarcoinUsage = async (body) => {
        return await ApiRequest.set("v1/barcoin/usage/create", "POST", body);
    }

    static createBarcoinUsageV2 = async (body) => {
        return await ApiRequest.set('v2/barcoin/usage/create', 'POST', body);
    }

    static getUserBarcoinUsage = async (userId) => {
        return await ApiRequest.set('v1/barcoin/usage/'+userId, 'GET');
    }


    static getAllRidesUsages = async (startDate, endDate) => {
        let formattedStartDate = moment(startDate, "YYYY-MM-DD").set({hour : 0, minute : 0, second : 0}).toDate()
        let formattedEndDate = moment(endDate, "YYYY-MM-DD").set({hour : 23, minute : 59, second : 59}).toDate()

        return await ApiRequest.set(`v1/rides/filter?start_date=${formattedStartDate}&end_date=${formattedEndDate}`, 'GET');
    }

    static createRidesUsage = async (body) => {
        return await ApiRequest.set('v1/rides', 'POST', body);
    }

    static getUserRideHistory = async (userId) => {
        return await ApiRequest.set('v1/rides/user/'+userId, 'GET');
    }

}