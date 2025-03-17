import { useEffect, useState } from "react";
import NoImg from '@/assets/offline.png'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { User } from "../../../../shared/core/User";
import { useDispatch, useSelector } from "react-redux";
import ProjectTasksFilter from "../components/ProjectTasksFilter";
import useProjects from "../hooks/useProjects";
import { searchByName } from "../../state/projectTasksFilterSlice";
import { setAvailablePackages, setActivePackages } from "../../state/activeProjectSlice";
import WorkPackage from "../components/WorkPackage";
import MultiSelector from "../components/MultiSelector";
import { useAuth } from "../../../../store-zustand";

export default function ProjectTasks() {
    const multiSelect = useSelector(state => state.projects.multiTasksSelector);
    const { filterWorkPackages, getProjectPackages } = useProjects();
    const filterName = useSelector(state => state.projects.projectTasksFilter.workPackageNameFilter);
    const activeProject = useSelector(state => state.projects.activeProject);
    const projectTasksFilters = useSelector(state => state.projects.projectTasksFilter);
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const { userInfo } = useAuth();
    const user = new User(userInfo);
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    const dispatch = useDispatch();
    const [workpackages, setWorkPackaes] = useState([]);
    const [wpView, setwpView] = useState([]);

    const [sort, setSort] = useState({ package_name: 0, estimated_duration: 0, work_package_progress: 0 });

    //Sort
    const filterBy = (filter) => {
        let obj = { estimated_duration: 0, package_name: 0, work_package_progress: 0 };
        sort[filter] == 1 ? obj[filter] = 2 : obj[filter] = 1;
        setSort(obj);
    }

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
        // eslint-disable-next-line
    }, [sort]);

    useEffect(() => {
        let project_id = activeProject.id;
        let specialty_ids = projectTasksFilters.selectedSpecialties.map((el) => { return el.specialty_id });
        let status_ids = projectTasksFilters.selectedStatus.map((el) => { return el.status_id });
        if (status_ids.length == 0 && specialty_ids.length == 0) {
            setWorkPackaes(activeProject.activePackages);
            setwpView(activeProject.activePackages);
        } else {
            filterWorkPackages(project_id, { specialty_ids, status_ids }).then((res) => {
                setWorkPackaes(res);
                setwpView(res);
            });
        }
        dispatch(searchByName(""));
        // eslint-disable-next-line
    }, [projectTasksFilters.selectedSpecialties, projectTasksFilters.selectedStatus]);

    useEffect(() => {
        if (filterName == "") {
            setwpView(workpackages);
        }
        else {
            let final = workpackages.filter((el) => {
                return el.package_name.toLowerCase().includes(filterName.toLowerCase());
            });
            setwpView(final);
        }
        // eslint-disable-next-line
    }, [filterName]);

    useEffect(() => {
        getProjectPackages(activeProject.id).then((result) => {
            let res = result[0];
            let x = res.applicable_work_packages.map((el) => {
                let index = res.active_work_packages.findIndex((wp) => { return wp.work_package_id == el.package_id })
                return (index == -1) && el
            })
            let final = x.filter(item => typeof item === 'object' && item !== null);
            dispatch(setAvailablePackages(final));
            dispatch(setActivePackages(res.active_work_packages));
            setwpView(res.active_work_packages);
            setWorkPackaes(res.active_work_packages);
        })
        // eslint-disable-next-line
    }, [refreshIndex]);

    return (
        <div className="col-12 d-flex flex-column flex-grow-1 position-relative p-3 pt-2"
            style={{ background: "#171829", borderTop: "1px solid grey" }}
        >

            {multiSelect.index && (<MultiSelector />)}
            <ProjectTasksFilter />
            <hr className="col-12 m-0" />
            {
                workpackages.length == 0 ? (<div className='col-12 d-flex flex-column align-items-center justify-content-center'>
                    <img height={100} src={NoImg} />
                    <p className=' text-center'>There are no workpackages ...</p>
                </div>) : (
                    <div className="overflow-auto col-12 flex-grow-1" style={{ height: "20px" }}>
                        <table className="table table-tree mb-0 ">
                            <thead>
                                <tr style={{ background: "#10101c !important" }}>
                                    <th>-</th>
                                    <th colSpan={projectTasksFilters.tableView.reduce((old, el, index) => {
                                        if (index < 4 && el.active) {
                                            return old + 1;
                                        }
                                        return old;
                                    }, 0)}>
                                        <div className="col-12 d-flex gap-3 align-items-center justify-content-center">
                                            Work Package Name
                                            <FontAwesomeIcon style={{ cursor: "pointer" }} icon={sort.package_name == 1 ? faArrowDown : faArrowUp} onClick={(event) => { event.stopPropagation(); filterBy("package_name") }} />
                                        </div>
                                    </th>
                                    {projectTasksFilters.tableView[4].active && <th>% Progress</th>}
                                    {projectTasksFilters.tableView[5].active && <th>Package Status</th>}
                                    {projectTasksFilters.tableView[6].active && <th>Package Duration</th>}
                                    {projectTasksFilters.tableView[7].active && <th>Start Date</th>}
                                    {projectTasksFilters.tableView[8].active && <th>End Date</th>}
                                    {user.isAppAdmin(appIndex) && projectTasksFilters.tableView[9].active && <th>Package Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    wpView.map((wp, index) => {
                                        return (
                                            <WorkPackage
                                                key={wp.log_id}
                                                info={wp}
                                                order={index}
                                                package_id={wp.work_package_id}
                                                package_name={wp.package_name}
                                                work_package_progress={wp.work_package_progress}
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