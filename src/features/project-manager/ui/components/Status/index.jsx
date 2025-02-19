import { useRecoilState } from "recoil"
import { $Defaults, $LoaderIndex } from "@/store-recoil"
import { useEffect, useRef, useState } from "react";
import { refresh } from "../../../../../shared/state/refreshIndexSlice";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import useProjects from "../../hooks/useProjects";
import Swal from "sweetalert2";
import { resetSelector } from "../../../state/multiTasksSelectorSlice";

export default function Status(props) {
    const dispatch = useDispatch();
    const [defaults] = useRecoilState($Defaults)
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const allStatus = useSelector(state => state.projects.projectTaskStatus.value);
    const multiSelect = useSelector(state => state.projects.multiTasksSelector);
    const theSelect = useRef();
    const [editIndex, setEditIndex] = useState(false);
    const { updateTaskStatus, updateMultiTasks } = useProjects();

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
        updateTaskStatus(log_id, obj).then((res) => {
            Swal.fire({
                icon: res == true ? "success" : "error",
                text: res == true ? "Task Status Updated !" : res == undefined ? "Connection Problem" : res,
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

    const updateWorkPackage = () => { };

    const updateMultiStatus = async (event) => {
        setLoaderIndex(true);
        let new_status_id = event.target.value;
        let tasks = multiSelect.tasks;
        let finalTasks = [];
        for (let task of tasks) {
            let current_progress = task.percentage;
            let can_affect_progress = allStatus.find(el => el.status_id == new_status_id).can_affect_progress;
            let change_progress_to = allStatus.find(el => el.status_id == new_status_id).change_progress_to;
            let obj = {
                log_id: task.log_id,
                status_id: new_status_id,
                is_active: can_affect_progress,
                task_progress: change_progress_to == null ? (current_progress == 100 ? 0 : current_progress) : change_progress_to
            };
            finalTasks.push(obj);
        }

        updateMultiTasks(finalTasks).then(() => {
            Swal.fire({
                icon: "success",
                text: "Task Status Updated  !",
                position: "top-end",
                timer: 800,
                showCloseButton: false,
                showConfirmButton: false,
            }).then(() => {
                setLoaderIndex(false);
                setEditIndex(false);
                dispatch(resetSelector());
                dispatch(refresh());
            });
        })
    }

    useEffect(() => {
        editIndex && theSelect.current.focus();
    }, [editIndex]);

    return (
        <div className="col-12 d-flex justify-content-center" style={{ cursor: "pointer" }}>
            {
                editIndex || props.isMulti ? (
                    <select ref={theSelect} disabled={multiSelect.tasks.length > 0 ? false : true} className="form-control" onBlur={() => setEditIndex(false)} onChange={(event) => { props.isMulti ? updateMultiStatus(event) : (props.is_package ? updateWorkPackage(event) : updateStatus(event)) }} defaultValue={props.status_id}>
                        <option value={-1} hidden>Select New Status</option>
                        {
                            allStatus.map((el) => {
                                return (
                                    <option key={el.status_id} value={el.status_id}>
                                        {el.status_name}
                                    </option>
                                )
                            })
                        }
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



