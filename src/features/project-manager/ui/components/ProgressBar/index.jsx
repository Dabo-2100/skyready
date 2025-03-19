import "./index.scss";
import { useEffect, useRef, useState } from 'react';
import Swal from "sweetalert2";
import { refresh } from "../../../../../shared/state/refreshIndexSlice";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { ProjectsRepo } from "../../../data/repositories/ProjectsRepo";
import { darkSwal, serverUrl, useToken } from "../../../../../store-zustand";

export default function ProgressBar({ status_id, log_id, percentage, canEdit }) {
    const dispatch = useDispatch();
    const { token } = useToken();
    const [editIndex, setEditIndex] = useState(false);
    const theSelect = useRef();
    const projectStatus = useSelector(state => state.projects.projectTaskStatus.value);

    const updateProgress = (event) => {
        event.preventDefault();
        let newProgress = theSelect.current.value;
        if ((newProgress != percentage) && newProgress >= 0 && newProgress <= 100) {
            let current_status_id = status_id;
            let done_status_id = projectStatus.find(el => el.can_affect_progress == 1 && el.change_progress_to == 100).status_id;
            let newStatus;
            if (newProgress == 100) {
                newStatus = done_status_id;
            } else {
                if (current_status_id == 1 || percentage == 100) {
                    newStatus = 2
                }
            }
            let obj = { log_id, task_progress: newProgress, status_id: newStatus }
            ProjectsRepo.update_progress(serverUrl, token, log_id, obj).then(() => {
                Swal.fire({
                    icon: "success",
                    text: "Task Progress Updated !",
                    customClass: darkSwal,
                    position: "top-end",
                    timer: 400,
                    showCloseButton: false,
                    showConfirmButton: false,
                }).then(() => {
                    dispatch(refresh());
                    setEditIndex(false);
                })
            })
        }
        else {
            setEditIndex(false);
        }
    }

    useEffect(() => {
        editIndex && theSelect.current.focus();
    }, [editIndex]);

    return (
        <>
            {
                editIndex ? (
                    <form noValidate onSubmit={updateProgress} className="col-12 d-flex align-items-center justify-content-center" style={{ cursor: "pointer", maxWidth: "150px" }}>
                        <input type="number" ref={theSelect} className="form-control" onBlur={updateProgress} defaultValue={percentage} />
                    </form>
                ) : (
                    <div
                        style={{ cursor: "pointer" }}
                        className='col-12 ProgressBar d-flex align-items-center justify-content-center'
                        onClick={() => { canEdit ? setEditIndex(!editIndex) : null }}
                    >
                        <span style={{ color: (percentage > 50) && ('white') }}>{percentage} %</span>
                        <div className="bar" style={{ width: percentage + "%" }}></div>
                    </div>
                )
            }
        </>
    )
}

ProgressBar.propTypes = {
    status_id: PropTypes.number,
    log_id: PropTypes.number,
    percentage: PropTypes.number,
    canEdit: PropTypes.string
}

// task Done By ()
// Progress Filed Input ( Free )
// Start-end Date (inprogress - complete) - Actual Duration