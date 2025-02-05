import { deleteProjectWorkPackage } from "../api/delete_project_work_package";
import { deleteWorkPackageTask } from "../api/delete_work_package_task";
import { indexProjectPackages } from "../api/index_project_packages";
import { indexProjectTaskStatus } from "../api/index_project_task_status";
import { indexProjects } from "../api/index_projects";
import { indexWorkPackageTasks } from "../api/index_work_package_tasks";
import { showProjectFilteredPackages } from "../api/show_project_packages";
import { showFilteredWorkPackages } from "../api/show_work_package_tasks";
import { storeNewProjectPackage } from "../api/store_new_project_package";
import { storeProject } from "../api/store_project";

export const ProjectsRepo = {
    all_projects: async (serverUrl, token, model_id) => {
        return await indexProjects(serverUrl, token, model_id);
    },

    all_project_task_status: async (serverUrl, token, model_id) => {
        return await indexProjectTaskStatus(serverUrl, token, model_id);
    },

    all_project_packages: async (serverUrl, token, model_id) => {
        return await indexProjectPackages(serverUrl, token, model_id);
    },

    filtered_project_packages: async (serverUrl, token, project_id, obj) => {
        return await showProjectFilteredPackages(serverUrl, token, project_id, obj);
    },

    all_work_package_tasks: async (serverUrl, token, project_id, package_id) => {
        return await indexWorkPackageTasks(serverUrl, token, project_id, package_id);
    },

    filtered_work_package_tasks: async (serverUrl, token, project_id, package_id, obj) => {
        return await showFilteredWorkPackages(serverUrl, token, project_id, package_id, obj);
    },

    remove_work_package_task: async (serverUrl, token, data) => {
        return await deleteWorkPackageTask(serverUrl, token, data);
    },

    add_new_project: async (serverUrl, token, data) => {
        return await storeProject(serverUrl, token, data);
    },

    start_project_package: async (serverUrl, token, data) => {
        return await storeNewProjectPackage(serverUrl, token, data);
    },

    remove_work_package_from_project: async (serverUrl, token, project_id, package_id) => {
        return await deleteProjectWorkPackage(serverUrl, token, project_id, package_id);
    },
}