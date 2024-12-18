import { useContext, useEffect, useRef, useState } from "react";
import WorkPackage from "../Components/WorkPackage";
import NoImg from '@/assets/offline.png'
import { ProjectsContext } from "../ProjectContext";
import { $Server, $Token, $Defaults, $LoaderIndex } from "@/store";
import { useRecoilState } from "recoil";
import { useProjectActivePackages, useSpecialties } from "@/customHooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faFilter, faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { HomeContext } from "@/Pages/HomePage/HomeContext";
import Status from "../Components/Status";
import FilterBar from "../Components/FilterBar";
import { User } from "../../Warehouse/Core/User";
import TaskContextMenu from "../Modals/TaskContextMenu";

export default function ProjectTasks() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const { refreshIndex, openModal2, menu, setMenu } = useContext(HomeContext);
    const { openedProject, taskFilter, clearFilters, setTaskFilter, multiSelect } = useContext(ProjectsContext);
    const [workpackages, setWorkPackaes] = useState([]);
    const [wpView, setwpView] = useState([]);
    const [defaults] = useRecoilState($Defaults);
    const [specialties, setSpecialties] = useState([]);
    // Filters Values
    const [status_id, setStatus_id] = useState(-1);
    const [specialty_id, setSpecialty_id] = useState(-1);

    const specialtySelect = useRef();
    const taskStatusSelect = useRef();

    const [sort, setSort] = useState({
        estimated_duration: 0,
        package_name: 0,
        work_package_progress: 0,
    });

    useEffect(() => {
        let tasks = [...wpView];
        let commonkey = "";
        let commonVal = "";
        for (const key in sort) { if (sort[key] != 0) { commonkey = key; commonVal = sort[key] } }
        if (commonkey == "package_name") {
            tasks.sort((a, b) => {
                let t1 = a;
                let t2 = b;
                if (commonVal == 2) { t1 = b; t2 = a }
                let val1 = t1.package_name;
                let val2 = t2.package_name;
                return val1.localeCompare(val2);
            });
        } else {
            tasks.sort((a, b) => {
                let t1 = a;
                let t2 = b;
                if (commonVal == 2) { t1 = b; t2 = a }
                let val1 = t1[commonkey];
                let val2 = t2[commonkey];
                return val1 - val2;
                // return val1.localeCompare(val2);
            });
        }
        setwpView(tasks);
    }, [sort]);

    const filterBy = (filter) => {
        let obj = { estimated_duration: 0, package_name: 0, work_package_progress: 0 };
        sort[filter] == 1 ? obj[filter] = 2 : obj[filter] = 1;
        setSort(obj);
    }

    const toggleFilter = (key) => {
        let oFilter = { ...taskFilter };
        oFilter.tableView[key] = !oFilter.tableView[key];
        setTaskFilter(oFilter);
    }

    const handleSearchWpName = () => {
        let val = event.target.value;
        let final = workpackages.filter((el) => {
            if (el.package_name.toLowerCase().includes(val.toLowerCase())) { return el }
        });
        setwpView(final);
    }

    const filterWPs = async (serverUrl, token, project_id) => {
        let final = [];
        let obj = taskFilter.filters;
        await axios.post(
            `${serverUrl}/php/index.php/api/project/workpackages/filter/${project_id}`,
            obj,
            { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => { if (res.data.data) { final = [...res.data.data] } })
            .catch((err) => { console.log(err); })
        return final;
    }

    useEffect(() => {
        useSpecialties(serverUrl, token).then((res) => {
            setSpecialties(res);
        })
    }, []);

    useEffect(() => {
        setLoaderIndex(1);
        useProjectActivePackages(serverUrl, token, openedProject).then((res) => {
            setWorkPackaes(res);
            setwpView(res);
            setLoaderIndex(0);
        })
    }, [refreshIndex]);

    useEffect(() => {
        if (specialty_id == -1 && status_id == -1) {
            clearFilters();
            setLoaderIndex(1);
            useProjectActivePackages(serverUrl, token, openedProject).then((res) => {
                setWorkPackaes(res);
                setwpView(res);
                setLoaderIndex(0)
            })
        }
        else {
            filterWPs(serverUrl, token, openedProject).then((res) => {
                setWorkPackaes(res);
                setwpView(res);
            })
        }
    }, [specialty_id, status_id]);

    const user = new User();

    return (
        <div className="col-12 d-flex flex-column flex-grow-1 position-relative p-3 rounded-3"
            style={{ background: "#171829" }}
            onClick={() => { taskFilter.closeTableFilter() }}
        >
            {menu.index && <TaskContextMenu />}
            {
                multiSelect.index && (
                    <div className="col-12 position-fixed top-0 animate__animated animate__fadeInDown "
                        style={{ left: 0, zIndex: "200", background: "#2c2e6e", boxShadow: "0 0 10px 4px #3F51B5" }}>
                        <div className="col-12 container d-flex align-items-center justify-content-between py-3" >
                            <h5 className="m-0" style={{ visibility: multiSelect.ids.length == 0 ? "hidden" : null }}>Selected Tasks : {multiSelect.ids.length}</h5>
                            <div className="col-4">
                                <Status isMulti={true} status_name="Change Status" status_id="-1" />
                            </div>
                            <FontAwesomeIcon className="bg-danger p-2 rounded-2" style={{ fontSize: "12px", }} icon={faX} onClick={() => { multiSelect.close() }} />
                        </div>
                    </div>
                )
            }

            <div className="col-12 d-flex flex-wrap gap-3">
                <div className="col-12 d-flex flex-wrap Search gap-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div>
                                <input type="search" className="form-control" onChange={handleSearchWpName} placeholder="Search Package Name" />
                            </div>
                            <div>
                                <select className="form-select"
                                    ref={specialtySelect}
                                    onChange={(event) => {
                                        setSpecialty_id(event.target.value);
                                        taskFilter.putSpecialty(event.target.value);
                                    }}
                                >
                                    <option value={-1} hidden>Select Specialty</option>
                                    {
                                        specialties.map((el) => {
                                            return (
                                                <option key={el.specialty_id} value={el.specialty_id}>
                                                    {el.specialty_name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div>
                                <select
                                    ref={taskStatusSelect}
                                    className="form-select"
                                    onChange={(event) => {
                                        setStatus_id(event.target.value);
                                        taskFilter.putStatus(event.target.value);
                                    }}
                                >
                                    <option value={-1} hidden>Select Task Status</option>
                                    {
                                        defaults.status.map((el) => {
                                            return (
                                                <option key={el.status_id} value={el.status_id}>
                                                    {el.status_name}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        {
                            (specialty_id != -1 || status_id != -1) && (
                                <button className="btn btn-danger" onClick={() => {
                                    setStatus_id(-1);
                                    setSpecialty_id(-1);
                                    specialtySelect.current.value = -1;
                                    taskStatusSelect.current.value = -1;
                                }}> Clear Filters</button>)
                        }
                    </div>
                </div>
                <hr className="col-12 m-0" />
                <div className="col-12 Filters d-flex justify-content-between gap-2">
                    <div className="actions d-flex align-items-center">
                        <div className="position-relative" onClick={
                            (event) => { event.stopPropagation(); taskFilter.openTableFilter() }
                        }>
                            {
                                (taskFilter.tableViewIndex) && (
                                    <div className="position-absolute z-3 rounded top-0 bg-dark animate__animated animate__fadeIn p-3 gap-2">
                                        {
                                            Object.keys(taskFilter.tableView).map((el) => {
                                                return (
                                                    <div key={el} className="d-flex align-items-center gap-2 table-hover">
                                                        <input onChange={() => toggleFilter(el)} type="checkbox" id={`the${el}`} defaultChecked={taskFilter.tableView[el]} />
                                                        <label htmlFor={`the${el}`}>{el}</label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            }

                            <button className="btn addBtn rounded-bottom-0"><FontAwesomeIcon icon={faFilter} /></button>
                        </div>
                    </div>
                    {
                        user.isAdmin() && (
                            <button style={{ fontSize: "14px" }} onClick={() => openModal2(6002)} className={`btn addBtn ${workpackages.length != 0 && 'rounded-bottom-0'} `}> + Start Work Package</button>
                        )
                    }
                </div>
            </div>

            {
                workpackages.length == 0 ? (<div className='col-12 d-flex flex-column align-items-center justify-content-center'>
                    <img height={100} src={NoImg} />
                    <p className=' text-center'>There are no workpackages ...</p>
                </div>) : (
                    <div className="overflow-auto col-12 flex-grow-1" style={{ height: "20px" }}>
                        <table className="table table-tree mb-0">
                            <thead>
                                <tr style={{ background: "#10101c !important" }}>
                                    <th>Order</th>
                                    <th colSpan={1 + taskFilter.tableView.taskType + taskFilter.tableView.task_desc + taskFilter.tableView.speciality}>
                                        <div className="d-flex gap-3 justify-content-center">
                                            <FontAwesomeIcon icon={sort.package_name == 1 ? faArrowDown : faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("package_name") }} />
                                            Work Package
                                        </div>
                                    </th>
                                    {taskFilter.tableView.progress && <th >
                                        <div className="d-flex gap-3 justify-content-center">
                                            <FontAwesomeIcon icon={sort.work_package_progress == 1 ? faArrowDown : faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("work_package_progress") }} />
                                            Progress %
                                        </div>
                                    </th>}
                                    {taskFilter.tableView.status && <th >Status</th>}
                                    {taskFilter.tableView.duration && <th >
                                        <div className="d-flex gap-3 justify-content-center">
                                            <FontAwesomeIcon icon={sort.estimated_duration == 1 ? faArrowDown : faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("estimated_duration") }} />
                                            Duration
                                        </div>
                                    </th>}
                                    {taskFilter.tableView.startDate && <th >Start Date</th>}
                                    {taskFilter.tableView.dueDate && <th >Due Date</th>}
                                    {taskFilter.tableView.task_tags && user.isAdmin() && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    wpView.map((wp, index) => {
                                        return (
                                            <WorkPackage
                                                key={wp.work_package_id}
                                                order={index}
                                                package_id={wp.work_package_id}
                                                package_name={wp.package_name}
                                                work_package_progress={
                                                    wp.total_done_time ? (wp.total_done_time / wp.estimated_duration) * 100 : wp.work_package_progress
                                                }
                                                status_name={wp.status_name}
                                                estimated_duration={wp.estimated_duration}
                                                start_at={(wp.start_at && wp.start_at.split("T")[0]) || "---"}
                                                end_at={(wp.end_at && wp.end_at.split("T")[0]) || "---"}
                                                wp_tags={wp.wp_tags}
                                            />
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div >
    )
}