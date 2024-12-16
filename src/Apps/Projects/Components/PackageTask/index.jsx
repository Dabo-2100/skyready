import { useContext } from "react"
import { ProjectsContext } from "../../ProjectContext"
import ProgressBar from "../ProgressBar"
import Status from "../Status"
import { FleetContext } from "../../../Fleet/FleetContext"
import { HomeContext } from "../../../../Pages/HomePage/HomeContext"
import { faComment, faEdit, faEye, faMessage, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Swal from "sweetalert2"
import axios from "axios"
import { $Server, $Token, $SwalDark } from "@/store";
import { useRecoilState } from "recoil"
import { User } from "../../../Warehouse/Core/User"

export default function PackageTask(props) {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { openModal2, refresh, menu, setMenu } = useContext(HomeContext);
    const { taskFilter, multiSelect } = useContext(ProjectsContext)
    const { setTaskToEdit, setOpenPackage_id } = useContext(FleetContext);
    const openContextMenu = (event) => {
        event.preventDefault()
        setMenu({ index: true, posX: event.clientX, posY: event.clientY })
        setOpenPackage_id(props.package_id);
        setTaskToEdit(props.task_id);
    }

    const handleRightClick = (event) => {
        event.preventDefault()
        setTaskToEdit(props.task_id);
        setOpenPackage_id(props.package_id);
        openModal2(4005);
    }

    const handleRemove = async () => {
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
            denyButtonText: "Not Now !",
            customClass: darkSwal,
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${serverUrl}/php/index.php/api/workpackage/tasks/delete`,
                    { "task_id": props.task_id },
                    { headers: { Authorization: `Bearer ${token}` } }
                ).then((res) => {
                    Swal.fire({
                        icon: "success",
                        text: "Task Removed Succesfully",
                        timer: 1500,
                        customClass: darkSwal
                    }).then(() => {
                        refresh();
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }

    const user = new User();

    return (
        <tr onContextMenu={openContextMenu} className='task animate__animated animate__fadeIn'>
            <td
                style={{ whiteSpace: "nowrap" }}
                onClick={(event) => {
                    event.stopPropagation();
                    !multiSelect.index && multiSelect.open();
                }}>
                {
                    multiSelect.index ? (
                        <input onChange={() => {
                            let obj = {
                                log_id: props.log_id,
                                percentage: props.task_progress
                            }
                            multiSelect.toggleTask(obj)
                        }
                        } type="checkbox" style={{ transform: "scale(2)" }} defaultChecked={props.selectAllIndex} />
                    ) : (props.task_index + 1)
                }
            </td>
            <th style={{ whiteSpace: "nowrap" }}>
                <div className="col-12 gap-3 p-2 d-flex align-items-center justify-content-center">
                    {props.task_name} {props.comments_no != 0 && <FontAwesomeIcon onClick={handleRightClick} icon={faComment} />}
                </div>
            </th>
            {taskFilter.tableView.taskType && <th width="300px" style={{ width: "300px" }}>{props.task_type_name}</th>}
            {taskFilter.tableView.speciality && <th style={{ whiteSpace: "nowrap" }}>{props.specialty_name}</th>}
            {taskFilter.tableView.progress && <th className="px-2" style={{ whiteSpace: "nowrap" }}><ProgressBar log_id={props.log_id} status_id={props.status_id} percentage={props.task_progress} canEdit="true" /></th>}
            {taskFilter.tableView.status && <th style={{ whiteSpace: "nowrap" }}><Status log_id={props.log_id} status_id={props.status_id} percentage={props.task_progress} status_name={props.status_name} /></th>}
            {taskFilter.tableView.duration && <th style={{ whiteSpace: "nowrap" }}>{props.task_duration}</th>}
            {taskFilter.tableView.startDate && <th style={{ whiteSpace: "nowrap" }}>{props.task_start_at && props.task_start_at.split("T")[0]} | {props.task_start_at && props.task_start_at.split("T")[1]} </th>}
            {taskFilter.tableView.dueDate && <th style={{ whiteSpace: "nowrap" }}>{props.task_end_at && props.task_end_at.split("T")[0]} | {props.task_end_at && props.task_end_at.split("T")[1]} </th>}
            {
                user.isAdmin() && (
                    <th style={{ whiteSpace: "nowrap" }}>
                        <div className="col-12 d-flex align-items-center justify-content-center gap-3">
                            <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faEye} className="text-secondary" onClick={handleRightClick} />
                            <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faTrash} className="text-danger" onClick={handleRemove} />
                        </div>
                    </th>
                )
            }
        </tr>
    )
}