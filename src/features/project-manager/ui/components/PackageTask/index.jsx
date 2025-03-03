
import ProgressBar from "../ProgressBar"
import Status from "../Status"
import { faComment, faEye, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRecoilValue } from "recoil"
import { User } from "../../../../../shared/core/User"
import { $UserInfo } from "../../../../../store-recoil"
import { useDispatch, useSelector } from "react-redux"
import { setActiveId } from "../../../../aircraft-fleet/state/activeWorkPackageTaskIdSlice"
import PropTypes from "prop-types"
import useProjects from "../../hooks/useProjects";
import { openModal2 } from "../../../../../shared/state/modalSlice"
import { toggleTask, toggleSeletor } from "../../../state/multiTasksSelectorSlice";
import { SiTicktick } from "react-icons/si";
import { TiDelete } from "react-icons/ti";
import { HiUserAdd } from "react-icons/hi";

import { useOperators } from "../../../../../store-zustand"
import Swal from "sweetalert2"
import { refresh } from "../../../../../shared/state/refreshIndexSlice"

export default function PackageTask(props) {
    const { openModal } = useOperators();
    const user = new User(useRecoilValue($UserInfo));
    const { removeWorkPackageTask, updateTaskOperators } = useProjects();
    const dispatch = useDispatch();
    const multiSelect = useSelector(state => state.projects.multiTasksSelector);
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    const taskFilter = useSelector(state => state.projects.projectTasksFilter);

    const openTaskDetails = (event) => {
        event.preventDefault()
        dispatch(setActiveId(props.task_id));
        dispatch(openModal2(4005));
    }

    const handleRemove = () => { removeWorkPackageTask(props.task_id) }

    const removeOperator = (user_id) => {
        let copy = [...props.operators];
        Swal.fire({
            icon: "question",
            title: "Are you sure you want to delete this operator ? ",
            showDenyButton: true,
        }).then((res) => {
            if (res.isConfirmed) {
                let final = copy.filter(el => el.user_id != user_id);
                updateTaskOperators(props.log_id, final.map(el => el.user_id)).then(
                    () => {
                        Swal.fire({
                            icon: "success",
                            title: "Operators Updated Successfully",
                            timer: 1500
                        }).then(() => {
                            dispatch(refresh());
                        })
                    }
                )
            }
        })
    }

    return (
        <tr className='task animate__animated animate__fadeIn'>
            <td
                style={{ whiteSpace: "nowrap" }}
                onClick={(event) => {
                    event.stopPropagation();
                    !multiSelect.index && dispatch(toggleSeletor());
                }}>
                {
                    multiSelect.index ? (
                        !multiSelect.selectAllIndex ? (
                            <input
                                onChange={() => { dispatch(toggleTask({ log_id: props.log_id, percentage: props.task_progress })) }}
                                type="checkbox"
                                defaultChecked={props.selectAllIndex ? true : false}
                                style={{ transform: "scale(1.5)", cursor: "pointer" }}
                            />
                        ) : <SiTicktick />
                    ) : (props.task_index + 1)
                }
            </td>
            <th style={{ whiteSpace: "nowrap" }}>
                <div className="col-12 gap-3 p-2 d-flex align-items-center justify-content-center">
                    {props.task_name} {props.comments_no != 0 && <FontAwesomeIcon onClick={openTaskDetails} icon={faComment} />}
                </div>
            </th>
            {taskFilter.tableView[1].active &&
                <th>
                    <div style={{ minWidth: "200px" }}>
                        {props.task_type_name}
                    </div>
                </th>
            }
            {taskFilter.tableView[2].active &&
                <th>
                    <div style={{ minWidth: "250px" }}>
                        {props.task_desc}
                    </div>
                </th>
            }
            {taskFilter.tableView[3].active &&
                <th style={{ whiteSpace: "nowrap" }}>
                    {props.specialty_name}
                </th>
            }
            {taskFilter.tableView[4].active &&
                <th className="px-2" style={{ whiteSpace: "nowrap" }}>
                    <div style={{ minWidth: "150px" }}>
                        <ProgressBar log_id={props.log_id} status_id={props.status_id} percentage={props.task_progress} canEdit="true" />
                    </div>
                </th>}
            {taskFilter.tableView[5].active &&
                <th style={{ whiteSpace: "nowrap" }}>
                    <div style={{ minWidth: "150px" }}>
                        <Status log_id={props.log_id} status_id={props.status_id} percentage={props.task_progress} status_name={props.status_name} />
                    </div>
                </th>
            }
            {taskFilter.tableView[6].active && <th style={{ whiteSpace: "nowrap" }}>{props.task_duration}</th>}
            {taskFilter.tableView[7].active && <th style={{ whiteSpace: "nowrap" }}>{props.task_start_at && props.task_start_at.split("T")[0]} | {props.task_start_at && props.task_start_at.split("T")[1]} </th>}
            {taskFilter.tableView[8].active && <th style={{ whiteSpace: "nowrap" }}>{props.task_end_at && props.task_end_at.split("T")[0]} | {props.task_end_at && props.task_end_at.split("T")[1]} </th>}
            {
                user.isAppAdmin(appIndex) && taskFilter.tableView[9].active && (
                    <th style={{ whiteSpace: "nowrap" }}>
                        <div className="col-12 d-flex align-items-center justify-content-center gap-3">
                            <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faEye} className="text-secondary" onClick={openTaskDetails} />
                            <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faTrash} className="text-danger" onClick={handleRemove} />
                            <HiUserAdd className="fs-4" style={{ cursor: "pointer" }} onClick={() => openModal(props.log_id)} />
                        </div>
                    </th>
                )
            }
            {
                taskFilter.tableView[10].active && <th className="m-0 p-0" style={{ whiteSpace: "nowrap" }}>
                    <div className="col-12 d-flex gap-2 p-2 flex-wrap">
                        {props.operators.map((el, index) => (
                            <p style={{ fontSize: "10px" }} className="p-1 align-items-center rounded-3 bg-primary fw-lighter" key={index}>{el.user_name} <TiDelete onClick={() => removeOperator(el.user_id)} className="fs-6" /></p>
                        ))}
                    </div>
                </th>
            }
        </tr>
    )
}

PackageTask.propTypes = {
    operators: PropTypes.array,
    status_id: PropTypes.number,
    task_duration: PropTypes.number,
    task_start_at: PropTypes.string,
    task_end_at: PropTypes.string,
    task_type_name: PropTypes.string,
    task_desc: PropTypes.string,
    specialty_name: PropTypes.string,
    task_name: PropTypes.string,
    task_index: PropTypes.number,
    comments_no: PropTypes.number,
    log_id: PropTypes.number,
    task_progress: PropTypes.number,
    task_id: PropTypes.number,
    selectAllIndex: PropTypes.bool,
    status_name: PropTypes.string,
};

