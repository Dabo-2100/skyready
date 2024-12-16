import { useRecoilState } from "recoil"
import { $Defaults, $Server, $Token, $SwalDark, $LoaderIndex } from "@/store"
import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useUpdate } from "@/customHooks";
import { ProjectsContext } from "../../ProjectContext";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";

export default function Status(props) {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [defaults] = useRecoilState($Defaults)
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);

    const theSelect = useRef();

    const [editIndex, setEditIndex] = useState(false);
    const { refresh } = useContext(HomeContext);
    const { multiSelect } = useContext(ProjectsContext);

    const updateStatus = (event) => {
        setLoaderIndex(1);
        let percentage = props.percentage;
        let newStatus = event.target.value;
        let log_id = props.log_id;
        let obj = {}
        obj.is_active = 1;
        if (newStatus == 1) {
            obj.task_progress = 0;
        }
        else if (newStatus == 4) {
            obj.task_progress = 100;
        }
        else if (newStatus != 1 && newStatus != 4 && newStatus != 5 && percentage == 100) {
            obj.task_progress = 0;
        }
        else if (newStatus == 5) {
            obj.task_progress = 100;
            obj.is_active = 0;
        }

        obj.status_id = newStatus;
        useUpdate(serverUrl, token, "project_tasks", `log_id = ${log_id}`, obj).then(() => {
            Swal.fire({
                icon: "success",
                text: "Task Status Updated  !",
                customClass: darkSwal,
                position: "top-end",
                timer: 800,
                showCloseButton: false,
                showConfirmButton: false,
            }).then(() => {
                setLoaderIndex(0)
                refresh();
                setEditIndex(false);
            })
        })
    }

    const updateMultiStatus = async (event) => {
        setLoaderIndex(1);
        let tasks = multiSelect.ids;
        for (let task of tasks) {
            let newStatus = event.target.value;
            let log_id = task.log_id;
            let percentage = task.percentage;
            let obj = {};
            obj.is_active = 1;
            if (newStatus == 1) {
                obj.task_progress = 0;
            } else if ((newStatus != 1 && newStatus != 4 && newStatus != 5) && percentage == 100) {
                obj.task_progress = 0;
            } else if (newStatus == 4) {
                obj.task_progress = 100;
            } else if (newStatus == 5) {
                obj.task_progress = 100;
                obj.is_active = 0;
            }
            obj.status_id = newStatus;
            // Wait for each update to complete before moving to the next task
            await useUpdate(serverUrl, token, "project_tasks", `log_id = ${log_id}`, obj);
        }

        // Once all tasks are updated
        Swal.fire({
            icon: "success",
            text: "Task Status Updated  !",
            customClass: darkSwal,
            position: "top-end",
            timer: 800,
            showCloseButton: false,
            showConfirmButton: false,
        }).then(() => {
            setLoaderIndex(0);
            multiSelect.close();
            setEditIndex(false);
            refresh();
        });
    }

    const updateWorkPackage = async (event) => {
        setLoaderIndex(1);
        await useUpdate(serverUrl, token, "project_work_packages", `work_package_id = ${props.package_id} AND project_id=${props.project_id}`, {
            status_id: event.target.value
        });
        Swal.fire({
            icon: "success",
            text: "Task Status Updated  !",
            customClass: darkSwal,
            position: "top-end",
            timer: 800,
            showCloseButton: false,
            showConfirmButton: false,
        }).then(() => {
            setLoaderIndex(0);
            multiSelect.close();
            setEditIndex(false);
            refresh();
        });
    }

    useEffect(() => {
        if (editIndex) { theSelect.current.focus() }
    }, [editIndex]);

    return (
        <div className="col-12 d-flex justify-content-center" style={{ cursor: "pointer" }}>
            {
                editIndex || props.isMulti ? (
                    <select ref={theSelect} className="form-control" onBlur={() => setEditIndex(false)} onChange={(event) => { props.isMulti ? updateMultiStatus(event) : (props.is_package ? updateWorkPackage(event) : updateStatus(event)) }} defaultValue={props.status_id}>
                        <option value={-1} hidden>Select New Status</option>
                        {defaults.status.map((el) => {
                            return (
                                <option key={el.status_id} value={el.status_id}>
                                    {el.status_name}
                                </option>
                            )
                        })}
                    </select>
                ) : (
                    <p
                        className="col-12 m-0 rounded p-2 fw-medium"
                        onClick={() => { setEditIndex(true) }}
                        style={{
                            color: `${defaults.status[props.status_id - 1].color}`,
                            backgroundColor: `${defaults.status[props.status_id - 1].bgColor}`
                        }}
                    >
                        {props.status_name}
                    </p>
                )
            }
        </div>
    )
}