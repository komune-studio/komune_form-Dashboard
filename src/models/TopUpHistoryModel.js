import ApiRequest from "../utils/ApiRequest";
import moment from "moment";

export default class TopUpHistoryModel {
    static getAll = async (startDate, endDate) => {

        console.log("SDED", startDate, endDate)

        let formattedStartDate = moment(startDate, "YYYY-MM-DD").set({hour : 0, minute : 0, second : 0}).toDate()
        let formattedEndDate = moment(endDate, "YYYY-MM-DD").set({hour : 23, minute : 59, second : 59}).toDate()

        console.log("SDED", formattedStartDate, formattedEndDate)

        return await ApiRequest.set(`v1/top-up-histories/filter?start_date=${formattedStartDate}&end_date=${formattedEndDate}`, "GET");
    }

    static getByUserId = async (id) => {
        return await ApiRequest.set("v1/top-up-history/"+id, "GET");
    }

}