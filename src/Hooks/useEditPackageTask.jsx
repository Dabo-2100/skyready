import { useContext } from "react";
import { FleetContext } from "../Apps/Fleet/FleetContext";
import { ProjectsContext } from "../Apps/Projects/ProjectContext";
import { buildTree, formCheck, reOrderTasks, useDelete, useGetData, useInsert, useUpdate } from "../customHooks";
import { useRecoilState, useRecoilValue } from "recoil";
import { $LoaderIndex, $Server, $SwalDark, $Token } from "../store";
import { HomeContext } from "../Pages/HomePage/HomeContext";
import axios from "axios";
import Swal from "sweetalert2";

export default function useEditPackageTask() {
    const { taskToEdit, selectedZones, selectedDesignators, openPackage_id } = useContext(FleetContext);
    const { openedProject } = useContext(ProjectsContext);
    const { refresh, closeModal } = useContext(HomeContext);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const darkSwal = useRecoilValue($SwalDark);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);

    const getComments = async () => {
        let final = [];
        await useGetData(serverUrl, token,
            `SELECT * FROM task_comments 
            WHERE log_id = (SELECT log_id FROM project_tasks WHERE task_id = ${taskToEdit} AND project_id = ${openedProject})
            ORDER BY created_at DESC `
        ).then((res) => {
            final = buildTree(res, "comment_id");
        })
        return final;
    }

    const getTaskInfo = async () => {
        let final = {};
        await axios.get(`${serverUrl}/php/index.php/api/workpackage/tasks/${taskToEdit}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            final = res.data.data[0];
        })
        return final;
    }

    const saveComment = async (comment_content) => {
        let hasErrors = formCheck([{ value: comment_content, options: { required: true } }])
        if (hasErrors == 0) {
            useGetData(serverUrl, token, `SELECT log_id FROM project_tasks WHERE task_id = ${taskToEdit} AND project_id = ${openedProject}`).then((res) => {
                let obj = { log_id: res[0].log_id, comment_content: comment_content };
                useInsert(serverUrl, token, "task_comments", obj).then((res) => {
                    Swal.fire({
                        icon: "success",
                        text: "Comment Added Successfully",
                        timer: 1200,
                    }).then(() => {
                        refresh();
                    })
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill Comment Content First",
                timer: 1200
            })
        }
    }

    const updateTask = async (taskInputs, taskInfo) => {
        let taskName = taskInputs.current[0].value;
        let taskDuration = taskInputs.current[1].value;
        let specialtyId = taskInputs.current[2].value;
        let taskTypeId = taskInputs.current[3].props.value.value || -1;
        let task_desc = taskInputs.current[4].value;

        const obj = {
            "specialty_id": specialtyId,
            "task_name": taskName,
            "task_duration": taskDuration,
            "task_type_id": taskTypeId,
            "task_desc": task_desc,
        };

        let data = [
            { value: taskName, options: { required: true } },
            { value: taskDuration, options: { required: true } },
            { value: specialtyId, options: { notEqual: -1 } },
            { value: taskTypeId, options: { notEqual: -1 } },
        ];

        let hasErrors = formCheck(data);
        if (hasErrors != 0) {
            Swal.fire({
                icon: "error",
                text: "Please fill required data !",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
            setLoaderIndex(false)
        } else {
            try {
                const task_id = taskInfo.task_id;
                useUpdate(serverUrl, token, "work_package_tasks", `task_id = ${task_id}`, obj).then(() => {
                    useDelete(serverUrl, token, "tasks_x_zones", `task_id = ${task_id}`).then(() => {
                        useDelete(serverUrl, token, "tasks_x_designators", `task_id = ${task_id}`).then(async () => {
                            const zonesInsertPromises = selectedZones.map(
                                (zone, index) => {
                                    let zone_id = zone.zone_id;
                                    useInsert(serverUrl, token, "tasks_x_zones", { task_id, zone_id })
                                }
                            );

                            const designatorsPromises = selectedDesignators.map((el) => {
                                let designator_id = el.designator_id;
                                useInsert(serverUrl, token, "tasks_x_designators", { task_id, designator_id })
                            }
                            );

                            await Promise.all(zonesInsertPromises);
                            await Promise.all(designatorsPromises);

                            Swal.fire({
                                icon: "success",
                                text: "Task Updated Succssefully!",
                                customClass: darkSwal,
                                timer: 1500,
                                showConfirmButton: false,
                            }).then(() => {
                                setLoaderIndex(false);
                            });
                        });
                    })
                }).then(() => {
                    reOrderTasks(serverUrl, token, openPackage_id);
                })
            } catch (error) {
                console.log(error);
            }
        }
    }

    const removeTask = async () => {
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
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "Yes , Remove it",
            denyButtonText: "Not Now !"
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${serverUrl}/php/index.php/api/workpackage/tasks/delete`,
                    { "task_id": taskToEdit },
                    { headers: { Authorization: `Bearer ${token}` } }
                ).then((res) => {
                    Swal.fire({
                        icon: "success",
                        text: "Task Removed Succesfully",
                        timer: 1500
                    }).then(() => {
                        closeModal();
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }

    const areArraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }
        return arr1.every((obj, index) => JSON.stringify(obj) === JSON.stringify(arr2[index]));
    }

    return { getComments, getTaskInfo, saveComment, updateTask, removeTask, areArraysEqual }
}
