import { useContext, useEffect, useRef, useState } from "react";
import { FleetContext } from "../FleetContext";
import { $Server, $Token, $LoaderIndex, $SwalDark } from "@/store";
import { useRecoilState } from "recoil";
import { useAircraftModels, getAircraftByModel, formCheck } from "@/customHooks";
import Swal from "sweetalert2";
import axios from "axios";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function NewDetailedPackage() {
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [serverUrl] = useRecoilState($Server);
    const [darkSwal] = useRecoilState($SwalDark);
    const [token] = useRecoilState($Token);
    const [models, setModels] = useState([]);
    const [aircraft, setAircraft] = useState([]);

    const [newApplicability, setNewApplicability] = useState([]);
    const { openModal, closeModal, openModal3, refresh, refreshIndex } = useContext(HomeContext);
    const { parent_id, activeWorkPackaeTypeId } = useContext(FleetContext);

    const [modelId, setModelId] = useState(-1);
    const new_model_id = useRef();
    const new_package_name = useRef();
    const new_package_details = useRef();
    const new_package_release_date = useRef();
    const new_package_version = useRef();
    const new_issued_duration = useRef();

    // const [tasks, setTasks] = useState([
    //     {
    //         task_order: 1,
    //         task_name: "Task 1",
    //         task_desc: "this is task",
    //         task_specailty: 1,
    //         task_duration: 3,
    //         working_zones: [1, 2, 3]
    //     }
    // ]);
    // const [viewTasks, setViewTasks] = useState([]);

    // const searchTasks = () => {
    //     let val = event.target.value;
    //     let orignalTasks = [...tasks];
    //     let final = orignalTasks.filter((el) => el.task_name.toLowerCase() == val.toLowerCase())
    //     setViewTasks(final);
    // }

    useEffect(() => {
        if (modelId != -1) {
            if (modelId > 1000) {
                setAircraft([]);
                new_model_id.current.value = -1;
                openModal3(+modelId);
            } else {
                getAircraftByModel(serverUrl, token, modelId).then((res) => {
                    setAircraft(res);
                })
            }
        }
        else {
            setAircraft([]);
        }
    }, [modelId]);

    useEffect(() => {
        setNewApplicability([]);
    }, [aircraft]);


    const handleSubmit = () => {
        let obj = {
            model_id: new_model_id.current.value,
            package_name: new_package_name.current.value,
            package_desc: new_package_details.current.value,
            package_version: new_package_version.current.value,
            package_issued_duration: new_issued_duration.current.value,
            package_release_date: new_package_release_date.current.value,
            package_type_id: activeWorkPackaeTypeId,
            parent_id: parent_id,
            is_folder: 0,
        };

        let hasErrors = formCheck([
            { value: new_model_id.current.value, options: { required: true } },
            { value: new_package_name.current.value, options: { notEqual: -1 } },
        ]);
        if (hasErrors == 0) {
            setLoaderIndex(true);
            axios.post(`${serverUrl}/php/index.php/api/packages/store`, obj, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
                if (!res.data.err) {
                    let data = res.data.data;
                    let final = data.find(el => (el.package_name == obj.package_name && el.parent_id == obj.parent_id));
                    let package_id = final.package_id;
                    if (newApplicability.length > 0) {
                        let promises = newApplicability.map((el) => {
                            let data = {
                                package_id: package_id,
                                aircraft_id: el,
                            };
                            let x = axios.post(`${serverUrl}/php/index.php/api/workpackage/applicability/store`, data, { headers: { Authorization: `Bearer ${token}` } });
                            return x;
                        })
                        Promise.all(promises).then((res) => {
                            Swal.fire({
                                icon: "success",
                                text: "New Work Package Added Successfully !",
                                timer: 1500,
                                showConfirmButton: false
                            }).then(() => {
                                setLoaderIndex(false);
                                refresh();
                                closeModal();
                            })
                        }).catch(err => { console.log(err); setLoaderIndex(false); })
                    }
                    else {
                        Swal.fire({
                            icon: "success",
                            text: "New Work Package Added Successfully !",
                            timer: 1500,
                            showConfirmButton: false
                        }).then(() => {
                            setLoaderIndex(false);
                            refresh();
                            closeModal();
                        })
                    }
                }
            }).catch((err) => {
                Swal.fire({
                    icon: "error",
                    text: res.data.msg.errorInfo[2],
                    customClass: darkSwal,
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    setLoaderIndex(false);
                })
                console.log(err);

            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const toggleApp = (id) => {
        let index = newApplicability.findIndex((el) => el == id);
        let orgApp = [...newApplicability];
        if (index == -1) {
            orgApp.push(id);
        } else {
            orgApp.splice(index, 1)
        }
        setNewApplicability(orgApp);
    }

    useEffect(() => {
        new_model_id.current.value = -1;
        setModelId(-1);
        useAircraftModels(serverUrl, token).then((res) => {
            setModels(res)
        })
    }, [refreshIndex]);

    return (
        <div className='col-12 animate__animated animate__fadeIn modal' id="newDetailedPackage">
            <div className="content">
                <div className="col-12 pt-2">
                    <button className="backButton" onClick={() => { closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <header className="col-12 m-0 p-0 px-3 pb-2 d-flex flex-wrap justify-content-between align-items-center">
                    <h1 className="mb-0 fs-4">Add Detailed Work Package</h1>
                    <div className="d-flex gap-3">
                        <button className="saveButton" onClick={handleSubmit}>
                            <div className="svg-wrapper-1">
                                <div className="svg-wrapper">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon">
                                        <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                    </svg>
                                </div>
                            </div>
                            <span>Add</span>
                        </button>
                        {/* <button className="btn btn-danger" 
                        }>close</button> */}
                        {/* <button className="btn addBtn">Save & Close</button> */}
                    </div>
                </header>
                <main className="col-12 d-flex flex-wrap p-0 m-0">
                    <section className="col-12 d-flex flex-wrap rounded shadow">
                        <main className="col-12">
                            <div className="col-12 col-lg-12">
                                <table className="table table-bordered text-center">
                                    <tbody>
                                        <tr>
                                            <th className="col-3">Work Package Name <span className="mand">*</span></th>
                                            <td className="col-3"><input ref={new_package_name} type="text" className="form-control" /></td>

                                            <th className="col-3">Work Package Description</th>
                                            <td className="col-3"><textarea ref={new_package_details} type="text" className="form-control" /></td>
                                        </tr>
                                        <tr>
                                            <th>Aircraft Model <span className="mand">*</span></th>
                                            <td>
                                                <select ref={new_model_id} className="form-select" onChange={(event) => setModelId(event.target.value)}>
                                                    <option value={-1} hidden>Select Aircaft Model</option>
                                                    {
                                                        models.map((el, index) => {
                                                            return <option key={index} value={el.model_id}>{el.model_name}</option>
                                                        })
                                                    }
                                                    <option value={1004} className="btn addBtn">New Model</option>
                                                </select>
                                            </td>

                                            <th>Package Applicability</th>
                                            <td>
                                                <div className="d-flex p-0 gap-2 col-12 flex-wrap justify-content-between myCheck">
                                                    {
                                                        aircraft.length > 0 && (
                                                            aircraft.map((el, index) => {
                                                                return (
                                                                    <div className="col-12 col-md-5" key={el.aircraft_serial_no}>
                                                                        <input id={`check-${el.aircraft_serial_no}`} type="checkbox" onChange={() => toggleApp(el.aircraft_id)} />
                                                                        <label htmlFor={`check-${el.aircraft_serial_no}`}>{el.aircraft_serial_no}</label>
                                                                    </div>
                                                                )
                                                            })
                                                        )
                                                    }
                                                    {
                                                        (new_model_id.current && new_model_id.current.value != -1 && new_model_id.current.value < 1000)
                                                        && (<div className="col-12 d-flex align-items-center gap-2 py-2">
                                                            <button className="btn addBtn col-12" onClick={() => { openModal3(1001) }}>Add Aircraft</button>
                                                        </div>)
                                                    }
                                                </div>
                                            </td>

                                        </tr>
                                        <tr>
                                            <th>Package Version</th>
                                            <td><input ref={new_package_version} type="text" className="form-control" /></td>

                                            <th>Package Release Data</th>
                                            <td><input ref={new_package_release_date} type="date" className="form-control" /></td>


                                        </tr>
                                        <tr>
                                            <th>Issued Duration in MNH</th>
                                            <td><input ref={new_issued_duration} type="number" className="form-control" /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </section>

                    {/* <section className="col-12 d-flex flex-wrap rounded shadow p-3">
                        <header className="col-12 d-flex fs-6 align-items-center justify-content-between">
                            <h5>Work Package Tasks06</h5>
                            <div className="d-flex align-items-center">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                <input className="form-control" />
                            </div>
                        </header>
                        <main className="col-12">
                            <div className="col-12">
                                <table className="table table-bordered text-center">
                                    <thead>
                                        <tr>
                                            <th rowSpan={2}>Order</th>
                                            <th rowSpan={2}>Task Name</th>
                                            <th rowSpan={2}>Task Type</th>
                                            <th rowSpan={1} colSpan={3}>Details</th>
                                            <th rowSpan={2}>Actions</th>
                                        </tr>
                                        <tr>
                                            <th>Specaility</th>
                                            <th>Man-Hours</th>
                                            <th>Working Areas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th rowSpan={3}>1</th>
                                            <th rowSpan={3}>task 1</th>
                                            <th rowSpan={3}>Task Type</th>
                                        </tr>
                                        <tr>
                                            <td rowSpan={1}>Avionics</td>
                                            <td rowSpan={1}>4</td>
                                            <td rowSpan={1}>110,120,130</td>
                                            <th rowSpan={3}>
                                                <div className="col-12 d-flex justify-content-center align-items-center gap-2">
                                                    <FontAwesomeIcon className="text-success bg-success-subtle p-2 rounded-5" icon={faAdd} />
                                                    <FontAwesomeIcon className="text-danger bg-danger-subtle  p-2 rounded-5" icon={faTrash} />
                                                    <FontAwesomeIcon className="text-info bg-info-subtle p-2 rounded-5" icon={faArrowUp} />
                                                    <FontAwesomeIcon className="text-info bg-info-subtle p-2 rounded-5" icon={faArrowDown} />
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <td rowSpan={1}>Avionics</td>
                                            <td rowSpan={1}>4</td>
                                            <td rowSpan={1}>110,120,130</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </section> */}
                </main>
                <footer className="col-12"></footer>
            </div >
        </div >
    )
}