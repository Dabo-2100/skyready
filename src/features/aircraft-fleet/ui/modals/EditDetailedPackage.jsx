import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { Accordion } from "react-bootstrap";
import usePackagesData from "../hooks/usePackagesData";
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import { useContext, useEffect, useRef, useState } from "react";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import { useDispatch } from "react-redux";
import { resetActiveId } from "../../state/activeWorkPackageIdSlice";

import SaveBtn from "../../../../Apps/Warehouse/UI/Components/SaveBtn";
import useAircraftData from "../hooks/useAircraftData";
import useAircraft from "../hooks/useAircraft";
import EditBtn from "../../../../shared/ui/components/EditBtn";
import TasksTable from "../components/TasksTable";
import usePackages from "../hooks/usePackages";

export default function EditDetailedPackage() {
    const dispatch = useDispatch();
    const { openModal3 } = useContext(HomeContext);
    const { getAircraftFleetByModel } = useAircraft();
    const { aircraftModels: models, aircraftFleet: aircraftFleet, setAircraftFleet } = useAircraftData();
    const { updateWorkPackageInfo } = usePackages();
    const { workPackageTasks, workPackageInfo: packageInfo, workPackageApplicablity } = usePackagesData();
    // Local States 
    const [editIndex, setEditIndex] = useState(false);
    const [selectedApplicablity, setSelectedApplicablity] = useState([]);
    // Refs
    const formInputs = useRef([]);
    // Component Methods 

    const handleModelChange = (event) => {
        getAircraftFleetByModel(event.target.value).then(setAircraftFleet);
        setSelectedApplicablity([]);
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
        return () => dispatch(resetActiveId()); // eslint-disable-next-line
    }, []);

    useEffect(() => {
        workPackageApplicablity.length > 0 && setSelectedApplicablity(workPackageApplicablity);
    }, [workPackageApplicablity]);


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

    // const handleReOrder = () => {
    //     setLoaderIndex(true);
    //     reOrderTasks(serverUrl, token, packageInfo.package_id).then(() => {
    //         setLoaderIndex(false)
    //         refresh();
    //     })
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

    // const removeWP = () => {
    //     Swal.fire({
    //         icon: "question",
    //         html: `
    //             <div class="d-flex flex-wrap gap-3">
    //                 <p class="text-danger">Are you sure you want to unregister this workpackage from the project ?</p>
    //                 <ul class="text-start fs-6">
    //                     <li>This Will Affect Project Progress</li>
    //                     <li>This Will Remove All Task Comments</li>
    //                 </ul>
    //             </div>
    //         `,
    //         showConfirmButton: true,
    //         showDenyButton: true,
    //         confirmButtonText: "Yes , Remove it",
    //         denyButtonText: "Not Now !"
    //     }).then((res) => {
    //         if (res.isConfirmed) {
    //             axios.post(`${serverUrl}/php/index.php/api/project/${openedProject}/workpackages/${openPackage_id}/remove`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
    //                 Swal.fire({
    //                     icon: "success",
    //                     text: "Workpacakge Removed Succesfully",
    //                     timer: 1500
    //                 }).then(() => {
    //                     closeModal();
    //                 })
    //             }).catch((err) => {
    //                 console.log(err);
    //             })
    //         }
    //     })
    // }

    return (
        <Modal id="newDetailedPackage">
            <Accordion className="col-12" defaultActiveKey={1} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header><h5>Work Package Tasks</h5></Accordion.Header>
                    <Accordion.Body>
                        <div className="d-flex justify-content-end pb-2 align-items-center gap-3">
                            <button className="btn bg-dark text-white" onClick={handleReOrder}>Reorder WorkPacakage</button>
                            <button className="btn addBtn d-flex align-items-center gap-2" onClick={() => { openModal3(4003) }}>
                                <FontAwesomeIcon icon={faAdd} /> New Task
                            </button>
                        </div>
                        <TasksTable workPackageTasks={workPackageTasks} />
                    </Accordion.Body>
                </Accordion.Item>
                {/* {(openedProject != 0) && (
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>
                            <h5>Project Info</h5>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="col-12 bg-white rounded mb-3 shadow p-3 border">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5>Project Actions</h5>
                                    <button className="btn btn-danger" onClick={removeWP
                                    }>Remove From Project</button>
                                </div>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Edit Work Package Status</th>
                                            <td>
                                                <Status
                                                    status_id={packageStatus}
                                                    status_name={packageStatusName}
                                                    project_id={openedProject}
                                                    package_id={openPackage_id}
                                                    is_package={true}
                                                />
                                            </td>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                )} */}
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
                                <div className="col-12 p-2 border-bottom d-flex flex-wrap align-content-center mb-3">
                                    <label className="col-12 mb-2">Model Name</label>
                                    <select
                                        ref={el => { formInputs.current[5] = el }}
                                        className="form-select"
                                        onChange={handleModelChange}
                                        disabled={!editIndex}
                                        defaultValue={packageInfo.model_id}
                                    >
                                        {
                                            models.map((el, index) => {
                                                return (<option key={index} value={el.model_id}>{el.model_name}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <p className="col-12 pb-2 px-2">Applicaplity</p>
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
                                                            defaultChecked={selectedApplicablity.some(x => x == el.aircraft_id)}
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