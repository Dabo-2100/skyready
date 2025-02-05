import { useRecoilState } from "recoil"
import { $Defaults, $Server, $Token, $SwalDark, $LoaderIndex } from "@/store-recoil"
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useUpdate } from "@/customHooks";
import { refresh } from "../../../../../shared/state/refreshIndexSlice";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { toggleSeletor, } from "../../../state/multiTasksSelectorSlice";

export default function Status(props) {
    const multiSelect = useSelector(state => state.projects.multiTasksSelector);
    const dispatch = useDispatch();
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [defaults] = useRecoilState($Defaults)
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const allStatus = useSelector(state => state.projects.projectTaskStatus.value);
    const theSelect = useRef();
    const [editIndex, setEditIndex] = useState(false);
    const updateStatus = (event) => {
        setLoaderIndex(true);
        let log_id = props.log_id;
        let current_progress = props.percentage;
        let new_status_id = event.target.value;
        let can_affect_progress = allStatus.find(el => el.status_id == new_status_id).can_affect_progress;
        let change_progress_to = allStatus.find(el => el.status_id == new_status_id).change_progress_to;
        let obj = {
            status_id: new_status_id,
            is_active: can_affect_progress,
            task_progress: change_progress_to == null ? (current_progress == 100 ? 0 : current_progress) : change_progress_to
        }

        useUpdate(serverUrl, token, "project_tasks", `log_id = ${log_id}`, obj).then(() => {
            Swal.fire({
                icon: "success",
                text: "Task Status Updated !",
                customClass: darkSwal,
                position: "top-end",
                timer: 800,
                showCloseButton: false,
                showConfirmButton: false,
            }).then(() => {
                setLoaderIndex(false)
                setEditIndex(false);
                dispatch(refresh());
            })
        })
    }

    const updateMultiStatus = async (event) => {
        setLoaderIndex(true);
        let new_status_id = event.target.value;
        let tasks = multiSelect.tasks;
        for (let task of tasks) {
            let log_id = task.log_id;
            let current_progress = task.percentage;
            let can_affect_progress = allStatus.find(el => el.status_id == new_status_id).can_affect_progress;
            let change_progress_to = allStatus.find(el => el.status_id == new_status_id).change_progress_to;
            let obj = {
                status_id: new_status_id,
                is_active: can_affect_progress,
                task_progress: change_progress_to == null ? (current_progress == 100 ? 0 : current_progress) : change_progress_to
            }
            await useUpdate(serverUrl, token, "project_tasks", `log_id = ${log_id}`, obj);
        }

        Swal.fire({
            icon: "success",
            text: "Task Status Updated  !",
            customClass: darkSwal,
            position: "top-end",
            timer: 800,
            showCloseButton: false,
            showConfirmButton: false,
        }).then(() => {
            setLoaderIndex(false);
            setEditIndex(false);
            dispatch(toggleSeletor());
            dispatch(refresh());
        });
    }

    const updateWorkPackage = async (event) => {
        setLoaderIndex(true);
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
            setLoaderIndex(false);
            dispatch(toggleSeletor());
            setEditIndex(false);
            dispatch(refresh());
        });
    }

    useEffect(() => {
        editIndex && theSelect.current.focus();
    }, [editIndex]);

    return (
        <div className="col-12 d-flex justify-content-center" style={{ cursor: "pointer" }}>
            {
                editIndex || props.isMulti ? (
                    <select ref={theSelect} className="form-control" onBlur={() => setEditIndex(false)} onChange={(event) => { props.isMulti ? updateMultiStatus(event) : (props.is_package ? updateWorkPackage(event) : updateStatus(event)) }} defaultValue={props.status_id}>
                        <option value={-1} hidden>Select New Status</option>
                        {allStatus.map((el) => {
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

Status.propTypes = {
    log_id: PropTypes.number,
    percentage: PropTypes.number,
    isMulti: PropTypes.bool,
    status_id: PropTypes.number,
    status_name: PropTypes.string,
    package_id: PropTypes.number,
    is_package: PropTypes.number,
}



