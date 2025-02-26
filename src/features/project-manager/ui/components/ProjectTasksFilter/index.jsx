import styles from "./index.module.css"
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import useAircraft from "../../../../aircraft-fleet/ui/hooks/useAircraft";
import { setSpecialties } from "../../../../aircraft-fleet/state/aircraftSpecialtiesSlice";
import { setTaskStatus } from "../../../state/projectTaskStatusSlice";
import useProjects from "../../hooks/useProjects";
import CheckBox from "../../../../../shared/ui/components/CheckBox";
import { FaFilter } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";
import { toggleStatus, toggleSpeciality, searchByName, toggleView, clearFilters } from "../../../state/projectTasksFilterSlice";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { openModal3 } from "../../../../../shared/state/modalSlice";
import { buildTree } from "../../../../../shared/utilities/buildTree";
import { setAircraftZones } from "../../../../aircraft-fleet/state/aircraftZonesSlice";

export default function ProjectTasksFilter() {
    const dispatch = useDispatch(() => { });
    const activeProject = useSelector(state => state.projects.activeProject);
    const aircraftZones = useSelector(state => state.aircraftFleet.aircraftZones.value);
    const projectTaskStatus = useSelector(state => state.projects.projectTaskStatus.value);
    const projectTasksFilter = useSelector(state => state.projects.projectTasksFilter);
    const aircraftSpecialties = useSelector(state => state.aircraftFleet.aircraftSpecialties.value);
    const filterName = useSelector(state => state.projects.projectTasksFilter.workPackageNameFilter);
    const { getAircraftSpecialties, getAircraftZones } = useAircraft();
    const { getProjectTaskStatus } = useProjects();
    const searchInput = useRef();
    const [canvasIndex, setCanvasIndex] = useState(false);

    useEffect(() => {
        if (aircraftSpecialties.length == 0) {
            getAircraftSpecialties().then((res) => { dispatch(setSpecialties(res)) });
        }

        if (projectTaskStatus.length == 0) {
            getProjectTaskStatus().then((res) => { dispatch(setTaskStatus(res)) });
        }
        if (aircraftZones.length == 0) {
            getAircraftZones(1).then((res) => {
                dispatch(setAircraftZones(buildTree(res, "zone_id")));
            })
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (filterName == "") { searchInput.current.value = "" }
        // eslint-disable-next-line
    }, [filterName])

    return (
        <div className="col-12 d-flex pb-2 flex-wrap justify-content-between">

            <div className="d-flex flex-wrap gap-2">
                {
                    projectTasksFilter.selectedSpecialties.concat(projectTasksFilter.selectedStatus).map((el, index) => {
                        return <span key={index} style={{ fontSize: "12px", padding: "0px 12px" }} className="d-flex gap-2 align-items-center bg-primary-subtle rounded-5 border border-primary text-primary">
                            {el.status_name || el.specialty_name}<TiDelete onClick={() => {
                                el.status_name && dispatch(toggleStatus(el));
                                el.specialty_name && dispatch(toggleSpeciality(el))
                            }} style={{ fontSize: "1.5rem", cursor: "pointer" }} className="text-danger" />
                        </span>
                    })
                }
            </div>

            <div className="d-flex align-items-center justify-content-end gap-3">
                <input ref={searchInput} onKeyUp={(e) => dispatch(searchByName(e.target.value))} className={styles.searchInput} placeholder="Search for workpackage" />
                <button className="btn btn-primary" type="button" onClick={() => { setCanvasIndex(true) }}>
                    <FaFilter />
                </button>
                {
                    (projectTasksFilter.selectedSpecialties.length > 0 || projectTasksFilter.selectedStatus.length > 0) && <button className="btn btn-danger" type="button" onClick={() => { dispatch(clearFilters()) }}>
                        <FaFilterCircleXmark />
                    </button>
                }
                {activeProject.availablePackages.length > 0 && <button className="btn addBtn" onClick={() => { dispatch(openModal3(6002)) }}>+ Add Package</button>}
            </div>

            {canvasIndex &&
                <div className={`${styles.canvasLayout}`} onClick={() => { setCanvasIndex(false) }}>
                    <div className={`${styles.canvasContent} animate__animated animate__fadeInLeft p-3 text-dark overflow-auto`} onClick={(event) => event.stopPropagation()}>
                        <div className="col-12">
                            <p className="mb-2">Filter By : Task Speciality</p>
                            <div className="col-12 bg-dark rounded p-3 d-flex flex-column gap-1">
                                {
                                    aircraftSpecialties.map((el, index) => {
                                        return <CheckBox onClick={() => { dispatch(toggleSpeciality(el)) }} key={el.specialty_id} id={`sp${index}`} checked={projectTasksFilter.selectedSpecialties.some(x => x.specialty_id == el.specialty_id)} content={el.specialty_name} />
                                    })
                                }
                            </div>
                            <hr className="col-12" />
                            <p className="mb-2">Filter By : Task Status Filter</p>
                            <div className="col-12 bg-dark rounded p-3 d-flex flex-column gap-1">
                                {
                                    projectTaskStatus.map((el, index) => {
                                        return <CheckBox onClick={() => { dispatch(toggleStatus(el)) }} key={el.status_id} id={`st${index}`} checked={projectTasksFilter.selectedStatus.some(x => x.status_id == el.status_id)} content={el.status_name} />
                                    })
                                }
                            </div>
                            <hr className="col-12" />
                            <p className="mb-2">Filter By : Task Zones</p>
                            <div className="col-12 bg-dark rounded p-3 d-flex flex-column gap-1">
                                {
                                    buildTree(aircraftZones, "zone_id").map((el, index1) => {
                                        return (
                                            <div key={el.zone_id} className="accordion" id="accordionExample">
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header d-flex align-items-center" id={`heading${index1}`}>
                                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index1}`} aria-expanded="true" aria-controls={`collapse${index1}`}>
                                                            {el.children.length == 0 && <CheckBox onClick={() => { }} key={el.zone_id} id={`pzn${index1}`} />}
                                                            {el.zone_name}
                                                        </button>
                                                    </h2>
                                                    {
                                                        el.children.length > 0 && <div id={`collapse${index1}`} className="accordion-collapse collapse bg-dark" aria-labelledby={`heading${index1}`} data-bs-parent="#accordionExample">
                                                            <div className="accordion-body">
                                                                {
                                                                    el.children.map((el, index) => {
                                                                        return <CheckBox onClick={() => { }} key={el.zone_id} id={`${index1}zn${index}`} content={el.zone_name} />
                                                                    })
                                                                }
                                                            </div>
                                                        </div>}
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <hr className="col-12" />
                            <p className="mb-2">Table View</p>
                            <div className="col-12 bg-dark rounded p-3 d-flex flex-column gap-1">
                                {
                                    projectTasksFilter.tableView.map((el, index) => {
                                        return <CheckBox onClick={() => dispatch(toggleView(el))} key={el.id} id={`tb${index}`} checked={el.active} content={el.name} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}
