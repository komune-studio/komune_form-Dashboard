import ApiRequest from '../utils/ApiRequest';

export default class UserApex {
	static getByNickname = async (nickname) => {
        return await ApiRequest.set(`v1/user-apex/nickname/${nickname}`, 'GET');
    }
}