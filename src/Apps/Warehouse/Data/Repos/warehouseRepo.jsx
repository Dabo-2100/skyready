import { indexCats } from "../Apis/index_item_cats";
import { indexItems } from "../Apis/index_items";
import { locationsIndex } from "../Apis/index_locations";
import { indexPacklists } from "../Apis/index_packlists";
import { indexUnits } from "../Apis/index_units";
import { storeItem } from "../Apis/store_item";
import { storeCat } from "../Apis/store_item_cats";
import { storeLocation } from "../Apis/store_location";
import { storePacklist } from "../Apis/store_packlist";
import { storeUnit } from "../Apis/store_unit";

export const warehouseRepo = {

    refresh_locations: async (serverUrl, token, warehouse_id) => {
        return await locationsIndex(serverUrl, token, warehouse_id);
    },

    all_items: async (serverUrl, token, page) => {
        return await indexItems(serverUrl, token, page);
    },

    all_cats: async (serverUrl, token) => {
        return await indexCats(serverUrl, token);
    },

    all_units: async (serverUrl, token) => {
        return await indexUnits(serverUrl, token);
    },

    all_packlists: async (serverUrl, token) => {
        return await indexPacklists(serverUrl, token);
    },

    new_cat: async (serverUrl, token, obj) => {
        return await storeCat(serverUrl, token, obj);
    },

    new_unit: async (serverUrl, token, obj) => {
        return await storeUnit(serverUrl, token, obj);
    },

    new_item: async (serverUrl, token, itemObj) => {
        return await storeItem(serverUrl, token, itemObj);
    },

    new_location: async (serverUrl, token, obj) => {
        return await storeLocation(serverUrl, token, obj);
    },

    new_packlist: async (serverUrl, token, obj) => {
        return await storePacklist(serverUrl, token, obj);
    },
}