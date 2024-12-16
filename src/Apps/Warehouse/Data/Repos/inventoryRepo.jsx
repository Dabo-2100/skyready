import { usersIndex } from "../Apis/index_users";
import { warehousesIndex } from "../Apis/index_warehouses";
import { storeWarehouse } from "../Apis/store_warehouse";
export const inventoryRepo = {
    get_warehouses: async (serverUrl, token) => {
        return await warehousesIndex(serverUrl, token);
    },
    get_warehouses_users: async (serverUrl, token) => {
        return await usersIndex(serverUrl, token);
    },
    new_warehouse: async (serverUrl, token, obj) => {
        return await storeWarehouse(serverUrl, token, obj);
    }
}