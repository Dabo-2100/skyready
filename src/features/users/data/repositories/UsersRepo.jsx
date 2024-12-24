import { deleteUser } from "../api/delete_user";
import { indexDefaults } from "../api/index_defaults";
import { indexUsers } from "../api/index_users";
import { showUser } from "../api/show_user";
import { storeUser } from "../api/store_user";
import { updateUserActive } from "../api/update_user_active";
import { updateUserFeatuers } from "../api/update_user_featuers";

export const UsersRepo = {
    all_users: async (serverUrl, token) => {
        return await indexUsers(serverUrl, token);
    },

    system_defaults: async (serverUrl, token) => {
        return await indexDefaults(serverUrl, token);
    },

    register_new_user: async (serverUrl, token, data) => {
        return await storeUser(serverUrl, token, data);
    },

    get_user_features: async (serverUrl, token, user_id) => {
        return await showUser(serverUrl, token, user_id);
    },

    update_user_features: async (serverUrl, token, data) => {
        return await updateUserFeatuers(serverUrl, token, data);
    },

    activate_user: async (serverUrl, token, user_id) => {
        return await updateUserActive(serverUrl, token, user_id);
    },

    delete_user: async (serverUrl, token, user_id) => {
        return await deleteUser(serverUrl, token, user_id);
    },
}
