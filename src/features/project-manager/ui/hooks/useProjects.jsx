import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import { useDispatch, useSelector } from "react-redux";
import { $Server, $SwalDark, $Token } from "../../../../store";
import { ProjectsRepo } from "../../data/repositories/ProjectsRepo";
import { refresh } from "../../../../shared/state/refreshIndexSlice";

export default function useProjects() {
    const dispatch = useDispatch();
    const token = useRecoilValue($Token);
    const serverUrl = useRecoilValue($Server);
    const darkSwal = useRecoilValue($SwalDark);
    const projectTasksFilters = useSelector(state => state.projects.projectTasksFilter);

    const getAllProjects = async () => {
        return await ProjectsRepo.all_projects(serverUrl, token);
    }

    const getProjectTaskStatus = async () => {
        return await ProjectsRepo.all_project_task_status(serverUrl, token);
    }

    const getProjectPackages = async (project_id) => {
        return await ProjectsRepo.all_project_packages(serverUrl, token, project_id);
    }

    const filterWorkPackages = async (project_id, obj) => {
        return await ProjectsRepo.filtered_project_packages(serverUrl, token, project_id, obj);
    }

    const getWorkPackageTasks = async (project_id, package_id) => {
        let final = [];
        let specialty_ids = projectTasksFilters.selectedSpecialties.map((el) => { return el.specialty_id });
        let status_ids = projectTasksFilters.selectedStatus.map((el) => { return el.status_id });
        if (specialty_ids.length == 0 && status_ids.length == 0) {
            final = await ProjectsRepo.all_work_package_tasks(serverUrl, token, project_id, package_id);
        }
        else {
            let obj = { specialty_ids, status_ids };
            final = ProjectsRepo.filtered_work_package_tasks(serverUrl, token, project_id, package_id, obj);
        }
        return final;
    }

    const removeWorkPackageTask = async (task_id) => {
        let data = { task_id: task_id }
        Swal.fire({
            icon: "question",
            html: `
                <div className="d-flex flex-wrap gap-3">
                    <p className="text-danger">Are you sure you want to remove this task from the workpackage ?</p>
                    <ul className="text-start fs-6">
                        <li>This Will Affect All Related Projects Progress</li>
                        <li>This Will Affect Workpackage Progress</li>
                        <li>This Will Remove All Task Comments</li>
                    </ul>
                </div>
            `,
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && ProjectsRepo.remove_work_package_task(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "Manufacturer Deleted Successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && dispatch(refresh());
                })
            })
        })
    }

    return {
        getAllProjects, getProjectTaskStatus, getProjectPackages, filterWorkPackages, getWorkPackageTasks, removeWorkPackageTask
    }
}