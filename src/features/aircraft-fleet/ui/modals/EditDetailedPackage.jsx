import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Accordion } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetActiveId } from "../../state/activeWorkPackageIdSlice";

import useAircraft from "../hooks/useAircraft";
import EditBtn from "../../../../shared/ui/components/EditBtn";
import TasksTable from "../components/TasksTable";
import usePackages from "../hooks/usePackages";
import { setAircraftFleet } from "../../state/aircraftFleetSlice"
import { setAircraftModels } from "../../state/aircraftModelsSlice";
import { setPackageInfo } from "../../state/activeWorkPackageInfoSlice";
import useProjects from "../../../project-manager/ui/hooks/useProjects";
import { openModal3 } from "../../../../shared/state/modalSlice";
import Modal from "../../../../shared/ui/modals/Modal";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";

export default function EditDetailedPackage() {
    const dispatch = useDispatch();
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const packageInfo = useSelector(state => state.aircraftFleet.activeWorkPackageInfo.value);
    const active_work_package_id = useSelector(state => state.aircraftFleet.activeWorkPackageId.value);
    const models = useSelector(state => state.aircraftFleet.aircraftModels.value);
    const aircraftFleet = useSelector(state => state.aircraftFleet.aircraftFleet.value);
    const activeProject = useSelector(state => state.projects.activeProject);
    const { removeWorkPackageFromProject } = useProjects();
    const { getAircraftFleetByModel, getAircraftModels } = useAircraft();
    const { updateWorkPackageInfo, getWorkPackageTasks } = usePackages();
    // Local States 
    const [editIndex, setEditIndex] = useState(false);
    const [workPackageTasks, setWorkPackageTasks] = useState([]);
    const [, setWorkPackageApplicablity] = useState([]);
    const [selectedApplicablity, setSelectedApplicablity] = useState([]);
    // Refs
    const formInputs = useRef([]);

    const handleModelChange = (event) => {
        getAircraftFleetByModel(event.target.value).then((res) => dispatch(setAircraftFleet(res)));
    }

    const handleSaveWPInfo = () => {
        updateWorkPackageInfo(formInputs, selectedApplicablity, packageInfo.package_id).then(() => setEditIndex(false))
    }

    const toggleApp = (aircraft_id) => {
        let oApp = [...selectedApplicablity];
        let index = oApp.findIndex((el) => el.aircraft_id == aircraft_id);
        index == -1 ? oApp.push(aircraftFleet.find(el => el.aircraft_id == aircraft_id)) : oApp.splice(index, 1);
        setSelectedApplicablity(oApp);
    }

    const handleReOrder = () => { }

    useEffect(() => {
        getAircraftModels().then((res) => dispatch(setAircraftModels(res))).then(() => {
            formInputs.current[5].value = packageInfo.model_id;
        });

        getWorkPackageTasks(active_work_package_id).then((res) => {
            setPackageInfo(res.info);
            setWorkPackageTasks(res.tasks);
            setWorkPackageApplicablity(res.info.applicability);
            setSelectedApplicablity(res.info.applicability)
        });
        // eslint-disable-next-line
    }, [active_work_package_id, refreshIndex])

    useEffect(() => {
        return () => dispatch(resetActiveId()); // eslint-disable-next-line
    }, []);

    // const handleReOrder = () => {
    //     setLoaderIndex(true);
    //     reOrderTasks(serverUrl, token, packageInfo.package_id).then(() => {
    //         setLoaderIndex(false)
    //         refresh();
    //     })
    // }

    // const closeWP = () => {
    //     if (editIndex) {
    //         Swal.fire({
    //             icon: "question",
    //             text: "All unsaved data will remove , Are you sure you want to exit ?",
    //             showDenyButton: true,
    //         }).then((res) => {
    //             res.isConfirmed && closeModal()
    //         })
    //     }
    //     else {
    //         closeModal()
    //     }
    // }



    // useEffect(() => {
    //     if (openedProject != 0) {
    //         useGetData(serverUrl, token, `
    //         `).then((res) => {
    //             setPackageStatus(res[0].status_id);
    //             let x = Defaults.status.find(el => { return el.status_id == res[0].status_id });
    //             setPackageStatusName(x.status_name);
    //         })
    //     }
    // }, [openedProject]);

    const removeWP = (event) => {
        event.stopPropagation();
        removeWorkPackageFromProject(activeProject.id, packageInfo.work_package_id);
    }

    return (
        <Modal id="newDetailedPackage">
            <Accordion className="col-12" defaultActiveKey={1} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header >
                        <div className="col-11 d-flex align-items-center justify-content-between">
                            <h5>Work Package Tasks</h5>
                            {(activeProject.id != 0) && <button className="btn btn-danger" onClick={removeWP}>Remove From Project</button>}
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="d-flex justify-content-end pb-2 align-items-center gap-3">
                            <button className="btn bg-dark text-white" onClick={handleReOrder}>Reorder WorkPacakage</button>
                            <button className="btn addBtn d-flex align-items-center gap-2" onClick={() => { dispatch(openModal3(4003)) }}>
                                <FontAwesomeIcon icon={faAdd} /> New Task
                            </button>
                        </div>
                        <TasksTable workPackageTasks={workPackageTasks} />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <h5>Work Package Info : {packageInfo.parent_name && (packageInfo.parent_name + " | ")} {packageInfo.package_name}</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="col-12 d-flex justify-content-end mb-2">
                            {editIndex ? (<SaveBtn label="Save" onClick={handleSaveWPInfo} />) : (<EditBtn label="Edit" onClick={() => setEditIndex(!editIndex)} />)}
                        </div>
                        <div className="col-12 d-flex flex-wrap">
                            <div className="col-12 col-md-6 p-2 border d-flex flex-wrap align-content-center">
                                <label className="col-12 mb-2">Work Package Name</label>
                                <input ref={el => { formInputs.current[0] = el }} className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_name} />
                            </div>

                            <div className="col-12 col-md-6 p-2 border">
                                <label className="col-12  mb-2">Release Version</label>
                                <input ref={el => { formInputs.current[2] = el }} type="text" className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_version} />
                            </div>

                            <div className="col-12 col-md-6 p-2 border">
                                <label className="col-12 mb-2">Release Date</label>
                                <input ref={el => { formInputs.current[3] = el }} type="date" className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_release_date} />
                            </div>

                            <div className="col-12 col-md-6 p-2 border">
                                <label className="col-12 mb-2">Issued Duration (HRs)</label>
                                <input ref={el => { formInputs.current[4] = el }} type="number" className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_issued_duration} />
                            </div>

                            <div className="col-12 col-md-6 p-2 border">
                                <label className="col-12  mb-2">Work Package Description</label>
                                <textarea ref={el => { formInputs.current[1] = el }} className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_desc} />
                            </div>

                            <div className="col-12 col-md-6 border d-flex flex-wrap justify-content-between myCheck gap-0">
                                {
                                    editIndex &&
                                    <div className="col-12 p-2 border-bottom d-flex flex-wrap align-content-center">
                                        <label className="col-12 mb-2">Model Name</label>
                                        <select
                                            ref={el => { formInputs.current[5] = el }}
                                            className="form-select"
                                            onChange={handleModelChange}
                                            disabled={!editIndex}
                                        >
                                            {
                                                models.map((el, index) => {
                                                    return (<option key={index} value={el.model_id}>{el.model_name}</option>)
                                                })
                                            }
                                        </select>
                                    </div>
                                }



                                <p className="col-12 pb-2 px-2 pt-2">Applicaplity</p>
                                <div className="col-12 d-flex flex-wrap gap-0">
                                    {
                                        !editIndex ?
                                            selectedApplicablity.map((el) => {
                                                return (
                                                    <div className="d-flex col-6 col-md-4 p-2 gap-2 algin-items-center" key={el.aircraft_id}>
                                                        <input
                                                            id={`check-${el.aircraft_id}`}
                                                            type="checkbox"
                                                            defaultChecked={true}
                                                            disabled={true}
                                                        />
                                                        <label htmlFor={`check-${el.aircraft_id}`}>{el.aircraft_serial_no}</label>
                                                    </div>
                                                )
                                            }) :
                                            aircraftFleet.map((el) => {
                                                return (
                                                    <div className="d-flex col-6 col-md-4 p-2 gap-2 algin-items-center" key={el.aircraft_id}>
                                                        <input
                                                            id={`check-${el.aircraft_id}`}
                                                            type="checkbox"
                                                            defaultChecked={selectedApplicablity.some(x => x.aircraft_id == el.aircraft_id)}
                                                            onChange={() => toggleApp(el.aircraft_id)}
                                                            disabled={!editIndex}
                                                        />
                                                        <label htmlFor={`check-${el.aircraft_id}`}>{el.aircraft_serial_no}</label>
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Modal>
    )
}