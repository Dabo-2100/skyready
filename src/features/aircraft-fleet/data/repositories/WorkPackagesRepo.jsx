import { indexWorkPackageTypes } from "../api/work-packages/index_workpackage_types";
import { indexWorkPackages } from "../api/work-packages/index_workpackages";

export const WorkPackagesRepo = {
    all_workpackages_types: async (serverUrl, token) => {
        return await indexWorkPackageTypes(serverUrl, token);
    },

    all_workpackages: async (serverUrl, token, workpackage_type_id) => {
        return await indexWorkPackages(serverUrl, token, workpackage_type_id);
    },

}
