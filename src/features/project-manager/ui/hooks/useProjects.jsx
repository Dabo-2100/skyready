import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import { useDispatch, useSelector } from "react-redux";
import { $Server, $SwalDark, $Token } from "../../../../store-recoil";
import { ProjectsRepo } from "../../data/repositories/ProjectsRepo";
import { refresh } from "../../../../shared/state/refreshIndexSlice";
import { formCheck } from "../../../../customHooks";

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

    const createNewProject = async (formInputs, workingDays) => {
        let data = {
            status_id: 2,
            project_name: formInputs.current[0].value,
            project_desc: formInputs.current[1].value,
            aircraft_id: formInputs.current[2] && formInputs.current[2].value || -1,
            project_start_date: formInputs.current[3].value,
            project_due_date: formInputs.current[4].value,
            work_start_at: formInputs.current[5].value,
            work_end_at: formInputs.current[6].value,
            working_days: workingDays.toString(),
        };

        let formErrors = formCheck([
            { value: data.project_name, options: { required: true } },
            { value: data.aircraft_id, options: { required: true, notEqual: -1 } },
            { value: data.project_start_date, options: { required: true, notEqual: -1 } },
            { value: data.project_due_date, options: { required: true, greaterThan: data.project_start_date } },
            { value: data.work_start_at, options: { required: true, notEqual: -1 } },
            { value: data.work_end_at, options: { required: true, notEqual: -1 } },
            { value: workingDays, options: { arrayNotEmpty: true } },
        ]);

        if (formErrors == 0) {
            ProjectsRepo.add_new_project(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Project Added Successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && dispatch(refresh());
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill All Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const startWorkPackage = async (package_start_date, selectedWP, project_id) => {
        let data = {
            project_id: project_id,
            package_id: selectedWP,
            package_start_date: package_start_date
        };

        let formErrors = formCheck([
            { value: data.package_id, options: { notEqual: -1 } },
            { value: data.package_start_date, options: { notEqual: -1 } }
        ]);

        if (formErrors == 0) {
            ProjectsRepo.start_project_package(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "Work Package Added Successfully To Your Project !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && dispatch(refresh());
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill All Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const removeWorkPackageFromProject = async (project_id, package_id) => {
        Swal.fire({
            icon: "question",
            html: `
                <div class="d-flex flex-wrap gap-3">
                    <p class="text-danger">Are you sure you want to unregister this workpackage from the project ?</p>
                    <ul class="text-start fs-6">
                        <li>This Will Affect Project Progress</li>
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
            res.isConfirmed && ProjectsRepo.remove_work_package_from_project(serverUrl, token, project_id, package_id).then((res) => {
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
        getAllProjects, getProjectTaskStatus, getProjectPackages, filterWorkPackages, getWorkPackageTasks, removeWorkPackageTask, removeWorkPackageFromProject, createNewProject, startWorkPackage
    }
}