import { deleteAircraftModel } from "../api/delete_aircraft_model";
import { deleteAircraftStatus } from "../api/delete_aircraft_status";
import { deleteManufacturer } from "../api/delete_aircraft_manufacturer";
import { deleteAircraftUsage } from "../api/delete_aircraft_usage";
import { indexAircarftApplicability } from "../api/index_aircarft_applicability";
import { indexAircraftFleet } from "../api/index_aircraft_fleet";
import { indexAircraftManufacturers } from "../api/index_aircraft_manufacturers";
import { indexAircraftModels } from "../api/index_aircraft_models";
import { indexAircraftStatus } from "../api/index_aircraft_status";
import { indexAircraftUsages } from "../api/index_aircraft_usages";
import { showAircraftInfo } from "../api/show_aircraft_info";
import { storeAircraft } from "../api/store_aircraft";
import { storeAircraftModel } from "../api/store_aircraft_model";
import { storeAircraftStatus } from "../api/store_aircraft_status";
import { storeAircraftUsage } from "../api/store_aircraft_usage";
import { storeManufacturer } from "../api/store_aircraft_manufacturer";
import { updateAircraftInfo } from "../api/update_aircraft_info";
import { indexAircraftFleetByModel } from "../api/index_aircraft_fleet_by_model";
import { indexAircraftSpecialties } from "../api/index_aircraft_specialties";
import { storeAircraftSpeciality } from "../api/store_aircraft_speciality";
import { deleteAircraftSpecaility } from "../api/delete_aircraft_speciality";
import { indexAircraftZones } from "../api/index_aircraft_zones";
import { storeAircraftZone } from "../api/store_aircraft_zone";
import { deleteAircraftZone } from "../api/delete_aircraft_zone";
import { showFilteredDesignators } from "../api/show_aircraft_filtered_designators";
import { indexDesignatorTypes } from "../api/index_designator_types";
import { storeAircraftDesignator } from "../api/store_aircraft_designator";
import { indexAircraftDesignators } from "../api/index_aircraft_designators";
import { updateAircraftDesignator } from "../api/update_aircraft_designator";
import { deleteAircraftDesignator } from "../api/delete_aircraft_designator";
import { showDesignatorTasks } from "../api/show_designator_tasks";

export const AircraftRepo = {
    all_aircraft_zones: async (serverUrl, token, model_id) => {
        return await indexAircraftZones(serverUrl, token, model_id);
    },

    all_aircraft_designators: async (serverUrl, token, model_id) => {
        return await indexAircraftZones(serverUrl, token, model_id);
    },

    show_designator_tasks: async (serverUrl, token, designator_id) => {
        return await showDesignatorTasks(serverUrl, token, designator_id);
    },

    all_aircraft_fleet: async (serverUrl, token) => {
        return await indexAircraftFleet(serverUrl, token);
    },

    all_aircraft_fleet_by_model: async (serverUrl, token, model_id) => {
        return await indexAircraftFleetByModel(serverUrl, token, model_id);
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

    all_aircraft_specialties: async (serverUrl, token) => {
        return await indexAircraftSpecialties(serverUrl, token);
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

    add_new_manufacturer: async (serverUrl, token, data) => {
        return await storeManufacturer(serverUrl, token, data);
    },

    delete_manufacturer: async (serverUrl, token, data) => {
        return await deleteManufacturer(serverUrl, token, data);
    },

    add_new_aircraft_status: async (serverUrl, token, data) => {
        return await storeAircraftStatus(serverUrl, token, data);
    },

    delete_aircraft_status: async (serverUrl, token, data) => {
        return await deleteAircraftStatus(serverUrl, token, data);
    },

    add_new_aircraft_model: async (serverUrl, token, data) => {
        return await storeAircraftModel(serverUrl, token, data);
    },

    delete_aircraft_model: async (serverUrl, token, data) => {
        return await deleteAircraftModel(serverUrl, token, data);
    },

    add_new_aircraft_usage: async (serverUrl, token, data) => {
        return await storeAircraftUsage(serverUrl, token, data);
    },

    delete_aircraft_usgae: async (serverUrl, token, data) => {
        return await deleteAircraftUsage(serverUrl, token, data);
    },

    add_new_aircraft_speciality: async (serverUrl, token, data) => {
        return await storeAircraftSpeciality(serverUrl, token, data);
    },

    delete_aircraft_speciality: async (serverUrl, token, data) => {
        return await deleteAircraftSpecaility(serverUrl, token, data);
    },

    add_new_aircraft_zone: async (serverUrl, token, data) => {
        return await storeAircraftZone(serverUrl, token, data);
    },

    delete_aircraft_zone: async (serverUrl, token, data) => {
        return await deleteAircraftZone(serverUrl, token, data);
    },

    filter_designators_by_name: async (serverUrl, token, data) => {
        return await showFilteredDesignators(serverUrl, token, data);
    },

    all_designator_types: async (serverUrl, token) => {
        return await indexDesignatorTypes(serverUrl, token);
    },

    all_aircraft_designators: async (serverUrl, token, model_id) => {
        return await indexAircraftDesignators(serverUrl, token, model_id);
    },

    add_new_aircraft_designator: async (serverUrl, token, data) => {
        return await storeAircraftDesignator(serverUrl, token, data);
    },

    update_designator_type: async (serverUrl, token, data) => {
        return await updateAircraftDesignator(serverUrl, token, data);
    },

    delete_aircraft_designator: async (serverUrl, token, data) => {
        return await deleteAircraftDesignator(serverUrl, token, data);
    },

}
