import "./index.scss";
import { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { useUpdate } from "@/customHooks";
import { ProjectsContext } from "../../ProjectContext";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";

export default function ProgressBar(props) {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [editIndex, setEditIndex] = useState(false);
    const [ratios] = useState([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    const { refresh } = useContext(HomeContext);

    const theSelect = useRef();

    const updateProgress = (event) => {
        let newProgress = event.target.value;
        let oStatus = props.status_id;
        let log_id = props.log_id;
        let obj = {}
        if (oStatus == 1 || oStatus == 4) {
            obj.task_progress = newProgress;
            if (newProgress == 100) {
                obj.status_id = 4;
            } else {
                obj.status_id = 2;
            }
        }
        else if (oStatus == 2) {
            if (newProgress == 100) {
                obj.status_id = 4;
            }
            obj.task_progress = newProgress;

        }
        else if (oStatus == 3) {
            obj.task_progress = newProgress;
        }
        else if (oStatus == 5) {

        }
        else {
            obj.task_progress = newProgress;
            if (newProgress == 100) {
                obj.status_id = 4;
            }
        }
        useUpdate(serverUrl, token, "project_tasks", `log_id = ${log_id}`, obj).then(() => {
            Swal.fire({
                icon: "success",
                text: "Task Progress Updated !",
                customClass: darkSwal,
                position: "top-end",
                timer: 800,
                showCloseButton: false,
                showConfirmButton: false,
            }).then(() => {
                refresh();
                setEditIndex(false);
            })
        })
    }

    useEffect(() => {
        if (editIndex) {
            theSelect.current.focus();
        }
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
