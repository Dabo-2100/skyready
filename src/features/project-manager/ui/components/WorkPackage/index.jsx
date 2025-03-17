import { faAngleRight, faArrowDown, faArrowUp, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import PackageTask from "../PackageTask";
import { User } from "../../../../../shared/core/User";
import { useDispatch, useSelector } from "react-redux";
import useProjects from "../../hooks/useProjects";
import { setActiveId } from "../../../../aircraft-fleet/state/activeWorkPackageIdSlice";
import PropTypes from "prop-types";
import { setPackageInfo } from "../../../../aircraft-fleet/state/activeWorkPackageInfoSlice";
import { openModal2 } from "../../../../../shared/state/modalSlice";
import { selectAllTasks, unselectAllTasks } from "../../../state/multiTasksSelectorSlice";
import { useAuth } from "../../../../../store-zustand";

export default function WorkPackage({ package_id, estimated_duration, package_name, start_at, end_at, work_package_progress, info }) {
    const dispatch = useDispatch();
    const selectAllRef = useRef();
    const { getWorkPackageTasks } = useProjects();
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const activeProjectId = useSelector(state => state.projects.activeProject.id);
    const projectTasksFilter = useSelector(state => state.projects.projectTasksFilter);

    const multiSelect = useSelector(state => state.projects.multiTasksSelector);
    const selectAllIndex = useSelector(state => state.projects.multiTasksSelector.selectAllIndex);

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [packageTasks, setPackageTasks] = useState([]);
    const [sort, setSort] = useState({ task_order: 0, task_progress: 0 })

    const openWorkPackageDetails = (event) => {
        event.stopPropagation();
        event.preventDefault();
        dispatch(setPackageInfo(info));
        dispatch(setActiveId(package_id));
        dispatch(openModal2(4002));
    }

    useEffect(() => {
        isCollapsed && getWorkPackageTasks(activeProjectId, package_id).then(setPackageTasks);
        // eslint-disable-next-line
    }, [refreshIndex, isCollapsed]);

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
        // eslint-disable-next-line
    }, [sort]);

    const filterBy = (filter) => {
        let obj = { task_order: 0, task_progress: 0 };
        sort[filter] == 1 ? obj[filter] = 2 : obj[filter] = 1;
        setSort(obj);
    }

    const selectAll = async () => {
        let tasks = [];
        if (selectAllIndex == false) {
            tasks = packageTasks.map((el) => { return { log_id: el.log_id, percentage: el.task_progress } });
            dispatch(selectAllTasks(tasks));
        } else {
            dispatch(unselectAllTasks());
        }
    }

    // useEffect(() => {
    //     selectAllRef.current && (selectAllRef.current.checked = selectAllIndex);

    // }, [selectAllIndex]);
    const { userInfo } = useAuth();
    const user = new User(userInfo);
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    return (
        <>
            <tr
                className={!isCollapsed ? "workPackage" : "activeWorkPackage"}
                style={{ position: "sticky", top: 0, zIndex: 250 }}
                onContextMenu={openWorkPackageDetails}
                onClick={() => { setIsCollapsed(!isCollapsed) }}
            >

                <th className="text-center" onClick={(e) => isCollapsed && e.stopPropagation()}>
                    {!isCollapsed ?
                        <FontAwesomeIcon icon={faAngleRight} /> :
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            {
                                multiSelect.index && (
                                    <input ref={selectAllRef} type="checkbox" style={{ transform: "scale(2)" }} className="form-check" onClick={selectAll} />
                                )
                            }
                        </div>
                    }
                </th>
                <th colSpan={projectTasksFilter.tableView.reduce((old, el, index) => {
                    if (index < 4 && el.active) { return old + 1 }
                    return old;
                }, 0)}>
                    {package_name}
                </th>

                {projectTasksFilter.tableView[4].active &&
                    <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>
                        <div className="d-flex gap-3 justify-content-center">
                            <span>{work_package_progress && work_package_progress.toFixed(1)} %</span>
                            {sort.task_progress != 1 && isCollapsed && <FontAwesomeIcon icon={faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("task_progress") }} />}
                            {sort.task_progress == 1 && isCollapsed && <FontAwesomeIcon icon={faArrowDown} onClick={(event) => { event.stopPropagation(); filterBy("task_progress") }} />}
                        </div>
                    </th>
                }
                {projectTasksFilter.tableView[5].active && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>
                    {/* {status_name} */}
                    -
                </th>}
                {projectTasksFilter.tableView[6].active && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>
                    <div className="d-flex gap-3 justify-content-center">
                        <span>{Math.round(estimated_duration)} HRs</span>
                        {sort.task_duration != 1 && isCollapsed && <FontAwesomeIcon icon={faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("task_duration") }} />}
                        {sort.task_duration == 1 && isCollapsed && <FontAwesomeIcon icon={faArrowDown} onClick={(event) => { event.stopPropagation(); filterBy("task_duration") }} />}

                    </div>
                </th>}
                {projectTasksFilter.tableView[7].active && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>{start_at}</th>}
                {projectTasksFilter.tableView[8].active && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>{end_at}</th>}
                {
                    user.isAppAdmin(appIndex) && projectTasksFilter.tableView[9].active && (
                        <th onClick={event => event.stopPropagation()} >
                            <FontAwesomeIcon onClick={openWorkPackageDetails} icon={faEdit} className="text-warning" />
                        </th>
                    )
                }
                {projectTasksFilter.tableView[10].active && <th onClick={event => event.stopPropagation()} style={{ cursor: "context-menu" }}>-</th>}
            </tr>
            {
                isCollapsed && (packageTasks.length > 0) && (
                    <>
                        <tr className="fixedRow" style={{ position: "sticky", top: "37px", zIndex: 200 }}>
                            <td>-</td>
                            {
                                projectTasksFilter.tableView.map((el, index) => {
                                    return el.active && <th key={index}>{el.name}</th>
                                })
                            }
                        </tr>
                        {
                            packageTasks.map((el, index) => {
                                return (
                                    <PackageTask
                                        task_index={index}
                                        package_id={package_id}
                                        taskInfo={el}
                                        selectAllIndex={selectAllIndex ? true : false}
                                        key={el.log_id}
                                        log_id={el.log_id}
                                        task_id={el.task_id}
                                        status_id={el.status_id}
                                        operators={el.task_operators}
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
                                        task_desc={el.task_desc}
                                        comments_no={el.comments_no}
                                    />)
                            })
                        }
                    </>
                )
            }
        </>
    )
}

WorkPackage.propTypes = {
    package_id: PropTypes.number,
    estimated_duration: PropTypes.number,
    work_package_progress: PropTypes.number,
    package_name: PropTypes.string,
    status_name: PropTypes.string,
    start_at: PropTypes.string,
    end_at: PropTypes.string,
    info: PropTypes.object
};