import ApiRequest from "utils/ApiRequest";

export default class TournamentModel {
    static create = async (body) => {
        return await ApiRequest.set('v1/tournament', "POST", body)
    }
}