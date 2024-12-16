import axios from "axios";
import Swal from "sweetalert2";
import { useContext, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { FleetContext } from "../FleetContext"
import { useAircraftModels, getAircraftByModel, useUpdate, useDelete, useTaskTypes, reOrderTasks } from "@/customHooks";
import { $Server, $Token, $LoaderIndex, $Defaults } from "@/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faCloud, faEdit } from "@fortawesome/free-solid-svg-icons";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import { ProjectsContext } from "../../Projects/ProjectContext";
import Status from "../../Projects/Components/Status";
import { useGetData } from "../../../customHooks";
import { Accordion } from "react-bootstrap";
import Modal from "../../Warehouse/UI/Modals/Modal";

export default function EditDetailedPackage() {
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [Defaults] = useRecoilState($Defaults);
    const { closeModal, openModal3, refresh, refreshIndex, } = useContext(HomeContext);
    const { openPackage_id, setTaskToEdit } = useContext(FleetContext);
    const { openedProject } = useContext(ProjectsContext);

    const [packageInfo, setPackageInfo] = useState({ applicability: [] });
    const [packageTasks, setPackageTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(false);

    const [models, setModels] = useState([]);
    const [aircraft, setAircraft] = useState([]);
    const [newApplicability, setNewApplicability] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [modelId, setModelId] = useState(0);
    const [packageStatus, setPackageStatus] = useState(1);
    const [packageStatusName, setPackageStatusName] = useState("Status");

    const new_model_id = useRef();
    const new_package_name = useRef();
    const new_package_details = useRef();
    const new_package_release_date = useRef();
    const new_package_version = useRef();
    const new_issued_duration = useRef();

    const new_task_name = useRef();
    const new_ = useRef();

    const getPackageData = async () => {
        setLoaderIndex(1);
        await axios.get(`${serverUrl}/php/index.php/api/packages/${openPackage_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            setPackageInfo(res.data.data.info);
            setPackageTasks(res.data.data.tasks);
            setNewApplicability(res.data.data.info.applicability.map((x) => x.aircraft_id));
            setModelId(res.data.data.info.model_id);
            setLoaderIndex(0);
        }).catch(err => console.log(err))
    }

    const closeWP = () => {
        if (editIndex) {
            Swal.fire({
                icon: "question",
                text: "All unsaved data will remove , Are you sure you want to exit?",
                showDenyButton: true,
            }).then((res) => {
                res.isConfirmed && closeModal()
            })
        }
        else {
            closeModal()
        }
    }

    const handleModelChange = () => {
        getAircraftByModel(serverUrl, token, event.target.value).then((res) => {
            setAircraft(res);
        })
        setNewApplicability([]);
        // setModelId(event.target.value)
    }

    const handleSaveWPInfo = () => {
        setLoaderIndex(1);
        let obj = {
            model_id: new_model_id.current.value,
            package_name: new_package_name.current.value,
            package_desc: new_package_details.current.value,
            package_version: new_package_version.current.value,
            package_release_date: new_package_release_date.current.value,
            // package_issued_duration: new_issued_duration.current.value,
        };
        useUpdate(serverUrl, token, "work_packages", `package_id = ${packageInfo.package_id}`, obj).then(() => {
            useDelete(serverUrl, token, "work_package_applicability", `package_id = ${packageInfo.package_id}`).then(() => {
                if (newApplicability.length > 0) {
                    let promises = newApplicability.map((el) => {
                        let data = {
                            package_id: packageInfo.package_id,
                            aircraft_id: el,
                        };
                        let x = axios.post(`${serverUrl}/php/index.php/api/workpackage/applicability/store`, data, { headers: { Authorization: `Bearer ${token}` } });
                        return x;
                    })
                    Promise.all(promises).then((res) => {
                        Swal.fire({
                            icon: "success",
                            text: "New Work Package Updated Successfully !",
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {

                        })
                    }).catch(err => console.log(err))
                }
                setLoaderIndex(0);
                refresh();
                // closeModal();
            })
        })
        setEditIndex(!editIndex)
    }

    const toggleApp = (id) => {
        let index = newApplicability.findIndex((el) => el == id)
        let orgApp = [...newApplicability];
        if (index == -1) {
            orgApp.push(id);
        } else {
            orgApp.splice(index, 1)
        }
        setNewApplicability(orgApp);
    }

    const showTask = (task_id) => {
        setTaskToEdit(task_id);
        openModal3(4005);
    }

    const handleReOrder = () => {
        setLoaderIndex(1);
        reOrderTasks(serverUrl, token, packageInfo.package_id).then(() => {
            setLoaderIndex(0)
            refresh();
        })
    }

    useEffect(() => {
        if (modelId && modelId != 0) {
            getAircraftByModel(serverUrl, token, modelId).then((res) => {
                setAircraft(res);
            })
            new_model_id.current.value = modelId;
        }
    }, [modelId])

    useEffect(() => {
        useAircraftModels(serverUrl, token).then((res) => { setModels(res) });
        useTaskTypes(serverUrl, token).then((res) => { setTaskTypes(res) });
        getPackageData();
    }, [refreshIndex]);

    useEffect(() => {
        if (openedProject != 0) {
            useGetData(serverUrl, token, `
                SELECT pwp.status_id FROM project_work_packages pwp WHERE pwp.work_package_id = ${openPackage_id}
            `).then((res) => {
                setPackageStatus(res[0].status_id);
                let x = Defaults.status.find(el => { return el.status_id == res[0].status_id });
                setPackageStatusName(x.status_name);
            })
        }
    }, [openedProject]);

    const removeWP = () => {
        Swal.fire({
            icon: "question",
            html: `
                <div class="d-flex flex-wrap gap-3">
                    <p class="text-danger">Are you sure you want to unregister this workpackage from the project ?</p>
                    <ul class="text-start fs-6">
                        <li>This Will Affect Project Progress</li>
                        <li>This Will Remove All Task Comments</li>
                    </ul>
                </div>
            `,
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "Yes , Remove it",
            denyButtonText: "Not Now !"
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${serverUrl}/php/index.php/api/project/${openedProject}/workpackages/${openPackage_id}/remove`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
                    Swal.fire({
                        icon: "success",
                        text: "Workpacakge Removed Succesfully",
                        timer: 1500
                    }).then(() => {
                        closeModal();
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }

    return (
        <Modal id="newDetailedPackage">
            <Accordion className="col-12" defaultActiveKey={openedProject == 0 ? ['0'] : ['1']} alwaysOpen>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <h5>Work Package Tasks</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="d-flex justify-content-end pb-2 align-items-center gap-3">
                            <button className="btn bg-dark text-white" onClick={handleReOrder}>Reorder WorkPacakage</button>
                            <button className="btn addBtn d-flex align-items-center gap-2" onClick={() => openModal3(4003)}>
                                <FontAwesomeIcon icon={faAdd} /> New Task
                            </button>
                        </div>
                        <table className="table table-bordered table-hover text-center table-dark packageTasks">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Task Name</th>
                                    <th>Task Specialty</th>
                                    <th>Task Type</th>
                                    <th>Task Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    packageTasks.map((el, index) => {
                                        return (
                                            <tr key={index} onClick={() => showTask(el.task_id)}>
                                                <td>{index + 1}</td>
                                                <td>{el.task_name}</td>
                                                <td>{el.specialty_name}</td>
                                                <td>{el.task_type_name}</td>
                                                <td>{el.task_duration}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            <tfoot></tfoot>
                        </table>
                    </Accordion.Body>
                </Accordion.Item>
                {(openedProject != 0) && (
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
                )}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <h5>Work Package Info : {packageInfo.parent_name && (packageInfo.parent_name + " | ")} {packageInfo.package_name}</h5>
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="col-12 d-flex justify-content-end">
                            {
                                !editIndex ? (
                                    <button className="editButton" onClick={() => setEditIndex(!editIndex)}>
                                        Edit
                                        <svg viewBox="0 0 512 512" className="svg"> <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                    </button>
                                ) : (
                                    <button className="saveButton" onClick={handleSaveWPInfo}>
                                        <div className="svg-wrapper-1">
                                            <div className="svg-wrapper">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon">
                                                    <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <span>Save</span>
                                    </button>
                                )
                            }
                        </div>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th className="col-3">Work Package Name</th>
                                    <td className="col-3 fw-bold">
                                        <input ref={new_package_name} className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_name} />
                                    </td>
                                    <th className="col-3 ">Work Package Description</th>
                                    <td className="col-3 fw-bold">
                                        <textarea ref={new_package_details} className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_desc} />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="col-3">Release Version</th>
                                    <td className="col-3 fw-bold">
                                        <input ref={new_package_version} className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_version} />
                                    </td>
                                    <th className="col-3">Release Date</th>
                                    <td className="col-3 fw-bold">
                                        <input ref={new_package_release_date} type="date" className="form-control" disabled={!editIndex} defaultValue={packageInfo.package_release_date} />
                                    </td>
                                </tr>
                                <tr>
                                    <th className="col-3">Model Name</th>
                                    <td className="col-3 fw-bold">
                                        <select
                                            ref={new_model_id}
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
                                    </td>
                                    <th className="col-3">Applicaplity</th>
                                    <td className="col-3 fw-bold">
                                        <div className="d-flex p-0 gap-2 col-12 flex-wrap justify-content-between myCheck">
                                            {
                                                aircraft.map((el) => {
                                                    return (
                                                        <div className="col-12 col-md-5" key={el.aircraft_id}>
                                                            <input
                                                                id={`check-${el.aircraft_id}`}
                                                                type="checkbox"
                                                                defaultChecked={newApplicability.findIndex((x) => x == el.aircraft_id) == -1 ? false : true}
                                                                onChange={() => toggleApp(el.aircraft_id)}
                                                                disabled={!editIndex}
                                                            />
                                                            <label htmlFor={`check-${el.aircraft_id}`}>{el.aircraft_serial_no}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>
        </Modal>
    )
}