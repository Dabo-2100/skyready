import "./index.scss";
import { faAngleDoubleDown, faAngleDown, faAngleRight, faArrowDown, faArrowUp, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react"
import { ProjectsContext } from "../../ProjectContext";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import PackageTask from "../PackageTask";
import axios from "axios";
import { HomeContext } from "@/Pages/HomePage/HomeContext";
import { FleetContext } from "../../../Fleet/FleetContext";
import { User } from "../../../Warehouse/Core/User";

export default function WorkPackage(props) {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { openModal2, refresh, refreshIndex, } = useContext(HomeContext);
    const { taskFilter, openedProject, multiSelect, setMultiSelect } = useContext(ProjectsContext);
    const { setOpenPackage_id } = useContext(FleetContext);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [packageTasks, setPackageTasks] = useState([]);
    const [selectAllIndex, setSelectAllIndex] = useState(false);
    const [sort, setSort] = useState({
        task_order: 0,
        task_progress: 0,
    })

    const getPackageTasks = async (serverUrl, token, openedProject, package_id) => {
        let final = [];
        if (Object.keys(taskFilter.filters).length == 0) {
            await axios.get(`${serverUrl}/php/index.php/api/project/${openedProject}/workpackages/${package_id}/tasks`, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.data.data) { final = res.data.data }
                })
                .catch((err) => { console.log(err); })
        }
        else {
            let obj = taskFilter.filters;
            await axios.post(`${serverUrl}/php/index.php/api/project/${openedProject}/workpackages/filter/${package_id}/tasks`, obj, { headers: { Authorization: `Bearer ${token}` } })
                .then((res) => {
                    if (res.data.data) { final = res.data.data }
                })
                .catch((err) => { console.log(err); })
        }
        return final;
    }

    const handleRightClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
        let package_id = props.package_id;
        setOpenPackage_id(package_id);
        openModal2(4002);

    }

    useEffect(() => {
        if (isCollapsed) {
            let package_id = props.package_id;
            getPackageTasks(serverUrl, token, openedProject, package_id).then((res) => {
                setPackageTasks(res);
            })
        }
    }, [isCollapsed, refreshIndex, props.estimated_duration]);

    useEffect(() => {
        let tasks = [...packageTasks];
        let commonkey = "";
        let commonVal = "";
        for (const key in sort) {
            if (key != 0) { commonkey = key; commonVal = sort[key]; }
        }
        tasks.sort((a, b) => {
            let t1 = a;
            let t2 = b;
            if (commonVal == 2) { t1 = b; t2 = a; }
            if (t1[commonkey] !== t2[commonkey]) {
                return t1[commonkey] - t2[commonkey];
            }
            return t1.task_name.localeCompare(t2.task_order);
        });
        setPackageTasks(tasks);
    }, [sort]);

    const filterBy = (filter) => {
        let obj = { task_order: 0, task_progress: 0 };
        sort[filter] == 1 ? obj[filter] = 2 : obj[filter] = 1;
        setSort(obj);
    }

    const selectAll = async () => {
        let oSelect = { ...multiSelect };
        oSelect.ids = [];
        if (!selectAllIndex) {
            packageTasks.forEach((el) => {
                let obj = {
                    log_id: el.log_id,
                    percentage: el.task_progress
                }
                oSelect.ids.push(obj)
            })
            oSelect.index = true;
            setMultiSelect(oSelect);
            setSelectAllIndex(true);
        }
        else {
            oSelect.index = false;
            setMultiSelect(oSelect);
            setSelectAllIndex(false);
        }
    }

    const user = new User();
    return (
        <>
            <tr className="workPackage"
                onContextMenu={handleRightClick}
                onClick={() => { setIsCollapsed(!isCollapsed) }}>
                <th className="text-center" onClick={(e) => isCollapsed && e.stopPropagation()}>
                    {!isCollapsed ?
                        <FontAwesomeIcon icon={faAngleRight} /> :
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <input type="checkbox" style={{ transform: "scale(2)" }} className="form-check" onClick={selectAll} />
                        </div>
                    }
                </th>
                <th colSpan={1 + taskFilter.tableView.taskType + taskFilter.tableView.speciality}>
                    <div className="d-flex gap-3 justify-content-center">
                        {props.package_name}
                    </div>
                </th>
                {taskFilter.tableView.progress &&
                    <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>
                        <div className="d-flex gap-3 justify-content-center">
                            <span>{props.work_package_progress && props.work_package_progress.toFixed(1)} %</span>
                            {sort.task_progress != 1 && isCollapsed && <FontAwesomeIcon icon={faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("task_progress") }} />}
                            {sort.task_progress == 1 && isCollapsed && <FontAwesomeIcon icon={faArrowDown} onClick={(event) => { event.stopPropagation(); filterBy("task_progress") }} />}
                        </div>
                    </th>
                }
                {taskFilter.tableView.status && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>
                    {/* {props.status_name} */}
                    -
                </th>}
                {taskFilter.tableView.duration && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>
                    <div className="d-flex gap-3 justify-content-center">

                        <span>{Math.round(props.estimated_duration)} HRs</span>
                        {sort.task_duration != 1 && isCollapsed && <FontAwesomeIcon icon={faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("task_duration") }} />}
                        {sort.task_duration == 1 && isCollapsed && <FontAwesomeIcon icon={faArrowDown} onClick={(event) => { event.stopPropagation(); filterBy("task_duration") }} />}

                    </div>
                </th>}
                {taskFilter.tableView.startDate && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>{props.start_at}</th>}
                {taskFilter.tableView.dueDate && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>{props.end_at}</th>}

                {
                    user.isAdmin() && (
                        <th onClick={event => event.stopPropagation()} >
                            <FontAwesomeIcon onClick={handleRightClick} icon={faEdit} className="text-warning" />
                        </th>
                    )
                }

            </tr>
            {
                isCollapsed && (packageTasks.length > 0) && (
                    packageTasks.map((el, index) => {
                        return (
                            <PackageTask
                                selectAllIndex={selectAllIndex}
                                package_id={props.package_id}
                                task_index={index}
                                key={el.log_id}
                                log_id={el.log_id}
                                task_id={el.task_id}
                                status_id={el.status_id}
                                status_name={el.status_name}
                                task_order={el.task_order}
                                task_progress={isNaN(el.task_progress) ? 0 : el.task_progress}
                                task_name={el.task_name}
                                task_duration={el.task_duration}
                                task_start_at={el.task_start_at}
                                task_end_at={el.task_end_at}
                                specialty_id={el.specialty_id}
                                specialty_name={el.specialty_name}
                                task_type_id={el.task_type_id}
                                task_type_name={el.task_type_name}
                                task_tags={el.task_tags}
                                comments_no={el.comments_no}
                            />)
                    })
                )
            }
        </>
    )
}