import { indexProject } from "../api/index_projects";

export const ReportRepo = {
    all_projects: async (serverUrl) => {
        return await indexProject(serverUrl);
    },
}