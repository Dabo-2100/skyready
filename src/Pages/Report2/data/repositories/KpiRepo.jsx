import { indexProject } from "../api/index_projects";
import { indexRemainTasks } from "../api/index_remain_tasks";

export const KpiRepo = {
    index_projects: async (serverUrl) => {
        return await indexProject(serverUrl);
    },

    get_remian_tasks: async (serverUrl, data) => {
        return await indexRemainTasks(serverUrl, data);
    },
}