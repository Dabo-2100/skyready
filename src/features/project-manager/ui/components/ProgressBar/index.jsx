import "./index.scss";
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import Swal from "sweetalert2";
import { useUpdate } from "@/customHooks";
import { refresh } from "../../../../../shared/state/refreshIndexSlice";
import { useDispatch } from "react-redux";

export default function ProgressBar(props) {
    const dispatch = useDispatch();
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [editIndex, setEditIndex] = useState(false);
    const [ratios] = useState([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    const theSelect = useRef();

    const updateProgress = (event) => {
        let newProgress = event.target.value;
        let current_status_id = props.status_id;
        let log_id = props.log_id;
        let obj = {
            log_id: log_id,
            task_progress: newProgress,
            status_id: newProgress == 100 && (current_status_id == 1 || current_status_id == 4) ? 2 : current_status_id,
        }
        useUpdate(serverUrl, token, "project_tasks", `log_id = ${log_id}`, obj).then(() => {
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

    useEffect(() => {
        editIndex && theSelect.current.focus();
    }, [editIndex]);

    return (
        <>
            {
                editIndex ? (
                    <select ref={theSelect} className="form-select" style={{ cursor: "pointer" }} onChange={updateProgress} onBlur={() => setEditIndex(false)} defaultValue={props.percentage}>
                        {
                            ratios.map((el, index) => {
                                return <option key={index} value={el}>{el} %</option>
                            })
                        }
                    </select>
                ) : (
                    <div
                        style={{ cursor: "pointer" }}
                        className='col-12 ProgressBar d-flex align-items-center justify-content-center'
                        onClick={() => { props.canEdit ? setEditIndex(!editIndex) : null }}
                    >
                        <span style={{ color: (props.percentage > 50) && ('white') }}>{props.percentage} %</span>
                        <div className="bar" style={{ width: props.percentage + "%" }}></div>
                    </div>
                )
            }
        </>
    )
}
