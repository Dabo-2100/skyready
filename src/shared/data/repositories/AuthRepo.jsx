import { userLogin } from "../api/user_login";
import { showUserInfoByToken } from "../api/show_user_info_by_token";

export const AuthRepo = {
    check_user_token: async (serverUrl, token) => {
        return await showUserInfoByToken(serverUrl, token);
    },
    user_login: async (serverUrl, token, data) => {
        return await userLogin(serverUrl, token, data);
    }
}