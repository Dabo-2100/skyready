import { deleteProject } from "../api/delete_project";
import { deleteProjectWorkPackage } from "../api/delete_project_work_package";
import { deleteTaskComment } from "../api/delete_task_comment";
import { deleteWorkPackageTask } from "../api/delete_work_package_task";
import { indexProjectPackages } from "../api/index_project_packages";
import { indexProjectTaskStatus } from "../api/index_project_task_status";
import { indexProjects } from "../api/index_projects";
import { indexTaskComments } from "../api/index_task_comments";
import { indexTaskOperators } from "../api/index_task_operators";
import { indexWorkPackageTasks } from "../api/index_work_package_tasks";
import { showProjectFilteredPackages } from "../api/show_project_packages";
import { showFilteredWorkPackages } from "../api/show_work_package_tasks";
import { storeNewComment } from "../api/store_new_comment";
import { storeNewProjectPackage } from "../api/store_new_project_package";
import { storeProject } from "../api/store_project";
import { updateMultiTasks } from "../api/update_multi_tasks";
import { updateProgress } from "../api/update_progress";
import { updateTaskOperators } from "../api/update_task_operators";
import { updateTaskStatus } from "../api/update_task_status";

export const ProjectsRepo = {
    all_projects: async (serverUrl, token, model_id) => {
        return await indexProjects(serverUrl, token, model_id);
    },

    all_project_task_status: async (serverUrl, token, log_id) => {
        return await indexProjectTaskStatus(serverUrl, token, log_id);
    },

    all_task_operators: async (serverUrl, token, model_id) => {
        return await indexTaskOperators(serverUrl, token, model_id);
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

    remove_project: async (serverUrl, token, data) => {
        return await deleteProject(serverUrl, token, data);
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

    all_task_comments: async (serverUrl, token, task_id, data) => {
        return await indexTaskComments(serverUrl, token, task_id, data);
    },

    add_new_comment: async (serverUrl, token, data) => {
        return await storeNewComment(serverUrl, token, data);
    },

    update_task_status: async (serverUrl, token, log_id, data) => {
        return await updateTaskStatus(serverUrl, token, log_id, data);
    },

    update_multi_tasks: async (serverUrl, token, tasks) => {
        return await updateMultiTasks(serverUrl, token, tasks);
    },

    update_task_operators: async (serverUrl, token, log_id, operators) => {
        return await updateTaskOperators(serverUrl, token, log_id, operators);
    },

    remove_task_comment: async (serverUrl, token, data) => {
        return await deleteTaskComment(serverUrl, token, data);
    },

    update_progress: async (serverUrl, token, log_id, data) => {
        return await updateProgress(serverUrl, token, log_id, data);
    },


}