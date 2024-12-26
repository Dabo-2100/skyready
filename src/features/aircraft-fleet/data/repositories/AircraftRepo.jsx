import { indexAircarftApplicability } from "../api/index_aircarft_applicability";
import { indexAircraftFleet } from "../api/index_aircraft_fleet";
import { indexAircraftManufacturers } from "../api/index_aircraft_manufacturers";
import { indexAircraftModels } from "../api/index_aircraft_models";
import { indexAircraftStatus } from "../api/index_aircraft_status";
import { indexAircraftUsages } from "../api/index_aircraft_usages";
import { showAircraftInfo } from "../api/show_aircraft_info";
import { storeAircraft } from "../api/store_aircraft";
import { updateAircraftInfo } from "../api/update_aircraft_info";

export const AircraftRepo = {
    all_aircraft_fleet: async (serverUrl, token) => {
        return await indexAircraftFleet(serverUrl, token);
    },

    all_aircraft_manufacturers: async (serverUrl, token) => {
        return await indexAircraftManufacturers(serverUrl, token);
    },

    all_aircraft_status: async (serverUrl, token) => {
        return await indexAircraftStatus(serverUrl, token);
    },

    all_aircraft_models: async (serverUrl, token) => {
        return await indexAircraftModels(serverUrl, token);
    },

    all_aircraft_usages: async (serverUrl, token) => {
        return await indexAircraftUsages(serverUrl, token);
    },

    register_new_aircraft: async (serverUrl, token, data) => {
        return await storeAircraft(serverUrl, token, data);
    },

    update_aircraft_info: async (serverUrl, token, data, aircraft_id) => {
        return await updateAircraftInfo(serverUrl, token, data, aircraft_id);
    },

    aircraft_info: async (serverUrl, token, aircarft_id) => {
        return await showAircraftInfo(serverUrl, token, aircarft_id);
    },

    aircraft_applicability: async (serverUrl, token, aircarft_id) => {
        return await indexAircarftApplicability(serverUrl, token, aircarft_id);
    },

}
