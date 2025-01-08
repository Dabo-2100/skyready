import { deleteFolderWorkpackage } from "../api/work-packages/delete_folder_workpackage";
import { deleteWorkpackageType } from "../api/work-packages/delete_workpackage_type";
import { indexWorkPackageTasks } from "../api/work-packages/index_workpackage_tasks";
import { indexWorkPackageTypes } from "../api/work-packages/index_workpackage_types";
import { indexWorkPackages } from "../api/work-packages/index_workpackages";
import { storeDetailedWorkpackage } from "../api/work-packages/store_detailed_workpackage";
import { storeFolderWorkPackage } from "../api/work-packages/store_folder_workpackage";
import { storeWorkpackageType } from "../api/work-packages/store_workpackage_type";
import { updateWorkPackageInfo } from "../api/work-packages/update_workpackage_info";

export const WorkPackagesRepo = {
    all_workpackages_types: async (serverUrl, token) => {
        return await indexWorkPackageTypes(serverUrl, token);
    },

    all_workpackages: async (serverUrl, token, workpackage_type_id) => {
        return await indexWorkPackages(serverUrl, token, workpackage_type_id);
    },

    all_workpackage_tasks: async (serverUrl, token, work_package_id) => {
        return await indexWorkPackageTasks(serverUrl, token, work_package_id);
    },

    add_new_workpackage_type: async (serverUrl, token, data) => {
        return await storeWorkpackageType(serverUrl, token, data);
    },

    add_new_folder_workpackage: async (serverUrl, token, data) => {
        return await storeFolderWorkPackage(serverUrl, token, data);
    },


    delete_workpackage_type: async (serverUrl, token, data) => {
        return await deleteWorkpackageType(serverUrl, token, data);
    },

    delete_folder_workpackage: async (serverUrl, token, data) => {
        return await deleteFolderWorkpackage(serverUrl, token, data);
    },

    update_workpackage_info: async (serverUrl, token, data, work_package_id) => {
        return await updateWorkPackageInfo(serverUrl, token, data, work_package_id);
    },

    add_new_detailed_workpackage: async (serverUrl, token, data) => {
        return await storeDetailedWorkpackage(serverUrl, token, data);
    },

}
