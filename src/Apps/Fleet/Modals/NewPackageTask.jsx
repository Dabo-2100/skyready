import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { useSpecialties, useTaskTypes, useAircraftZones, buildTree, useInsert, formCheck } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import TreeView from "../Components/Tree";
import { HomeContext } from "@/Pages/HomePage/HomeContext";
import { reOrderTasks } from "@/customHooks";
import Select from 'react-select';
import { faGears, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NewPackageTask() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { closeModal, openModal4, refreshIndex, refresh } = useContext(HomeContext);
    const { openPackage_id, setSpecialty_id, selectedZones, setSelectedZones, selectedDesignators, setSelectedDesignators, removeSelectedZone, removeSelectedDesignator } = useContext(FleetContext);

    const new_task_name = useRef();
    const new_task_duration = useRef();
    const new_type_id = useRef();
    const new_speciality_id = useRef();

    const [specialties, setSpecialties] = useState([]);
    const [aircraftZones, setAircraftZones] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [packageInfo, setPackageInfo] = useState({ package_name: "" });

    const handleChange = (isSpecialty) => {
        if (isSpecialty == 1) {
            if (event.target.value > 1000) {
                openModal4(5000);
            }
            else {
                setSpecialty_id(event.target.value);
                useTaskTypes(serverUrl, token, event.target.value).then(res => setTaskTypes(res));
            }
        }
        else if (isSpecialty == 0) {
            if (event.target.value > 1000) {
                openModal4(+event.target.value);
                event.target.value = 0;
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let taskName = new_task_name.current.value;
        let taskDuration = new_task_duration.current.value;
        let specialtyId = new_speciality_id.current.value;
        let taskTypeId = new_type_id.current.props.value.value || -1;

        const obj = {
            "package_id": openPackage_id,
            "task_name": taskName,
            "task_duration": taskDuration,
            "specialty_id": specialtyId,
            "task_type_id": taskTypeId,
        };
        let data = [
            { value: taskName, options: { required: true } },
            { value: taskDuration, options: { required: true } },
            { value: specialtyId, options: { notEqual: -1 } },
            { value: taskTypeId, options: { notEqual: -1 } },
        ];
        let hasErrors = formCheck(data);
        if (hasErrors != 0) {
            Swal.fire({
                icon: "error",
                text: "Please fill required data !",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        } else {
            try {
                const response = await axios.post(`${serverUrl}/php/index.php/api/workpackage/tasks/store`, obj, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.data.err) {
                    const task_id = response.data['task_id'];
                    const zonesInsertPromises = selectedZones.map(
                        (zone, index) => {
                            let zone_id = zone.zone_id;
                            useInsert(serverUrl, token, "tasks_x_zones", { task_id, zone_id })
                        }
                    );

                    const designatorsPromises = selectedDesignators.map((el) => {
                        let designator_id = el.designator_id;
                        useInsert(serverUrl, token, "tasks_x_designators", { task_id, designator_id })
                    }
                    );

                    await Promise.all(zonesInsertPromises);
                    await Promise.all(designatorsPromises);
                    await reOrderTasks(serverUrl, token, openPackage_id);

                    Swal.fire({
                        icon: "success",
                        text: "New Task Added Succssefully to Your work package!",
                        customClass: darkSwal,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        refresh();
                        closeModal();
                    });

                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.data.msg.errorInfo[2],
                        customClass: darkSwal,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }

    };

    const getPackageData = async () => {
        let final = {};
        await axios.get(`${serverUrl}/php/index.php/api/packages/${openPackage_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            final = res.data.data.info;
        }).catch(err => console.log(err))
        return final;
    }

    useEffect(() => {
        getPackageData().then((res) => {
            setPackageInfo(res);
            useAircraftZones(serverUrl, token, res.model_id).then((res) => {
                setAircraftZones(buildTree(res, "zone_id"));
            });
        });
        if (new_speciality_id && new_speciality_id.current.value != -1) {
            useTaskTypes(serverUrl, token, new_speciality_id.current.value).then(res => setTaskTypes(res));
        } else {
            new_speciality_id.current.value = -1;
            setTaskTypes([]);
            useSpecialties(serverUrl, token).then((res) => { setSpecialties(res) })
        }
    }, [refreshIndex]);

    return (
        <div className="modal">
            <div className="content animate__animated animate__fadeIn" onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12">
                    <button type="button" className="backButton" onClick={() => { setSelectedZones([]); setSelectedDesignators([]); closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                    <h1 className="fs-5">New Task to : {packageInfo.package_name}</h1>
                    <button className="saveButton" onClick={handleSubmit}>
                        <div className="svg-wrapper-1">
                            <div className="svg-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon">
                                    <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                </svg>
                            </div>
                        </div>
                        <span>Save</span>
                    </button>
                </header>
                <main className="col-12 d-flex flex-wrap">
                    <form className="col-12 d-flex flex-wrap gap-3  justify-content-lg-between" onSubmit={handleSubmit}>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Task Name <span className="text-danger">*</span></label>
                            <input className="col-12 form-control" type="text" id="sn" ref={new_task_name} placeholder="Enter New Task Name" required />
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="rn">Task Duration <span className="text-danger">*</span></label>
                            <input className="col-12 form-control" type="number" id="rn" ref={new_task_duration} placeholder="Enter Task Duration" required />
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Specialty <span className="text-danger">*</span></label>
                            <select ref={new_speciality_id} className="col-12 form-select" onChange={() => handleChange(1)} required>
                                <option hidden value={-1} >Select Specialty</option>
                                {
                                    specialties.map((el, index) => {
                                        return (<option value={el.specialty_id} key={index}>{el.specialty_name}</option>)
                                    })
                                }
                                <option value={5000} className="btn addBtn py-2">Add New Specialty</option>
                            </select>
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            {
                                (new_speciality_id.current && new_speciality_id.current.value != -1) && (
                                    <>
                                        <div className="col-12 d-flex align-items-center justify-content-between">
                                            <label htmlFor="sn">Task Type <span className="text-danger">*</span></label>
                                            <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => openModal4(4004)} icon={faGears} />
                                        </div>
                                        <Select
                                            ref={new_type_id}
                                            className="col-12"
                                            options={taskTypes.map(el => { return { value: el.type_id, label: el.type_name } })}
                                        />
                                    </>
                                )
                            }

                        </div>
                        <hr className="col-12 m-0" />
                        <div className="col-12 d-flex flex-wrap">
                            <div className="col-12 d-flex flex-wrap">
                                <div className="col-12 d-flex align-items-center justify-content-between">
                                    <label>Working Zones</label>
                                    <button className="addMoreButton" type="button" onClick={() => openModal4(1006)}>
                                        <div className="sign">+</div>
                                        <div className="text">Add Zone</div>
                                    </button>
                                </div>
                                <div className="col-12 d-flex gap-2 flex-wrap">
                                    {
                                        (selectedZones.length > 0) && (selectedZones.map((zone, index) => {
                                            return (
                                                <button type="button" className="btn d-flex align-items-center gap-2 addBtn" key={zone.zone_id} >
                                                    <p>{zone.zone_name}</p>
                                                    <FontAwesomeIcon onClick={() => removeSelectedZone(zone.zone_id)} icon={faX} />
                                                </button>
                                            )
                                        })
                                        )
                                    }
                                </div>
                            </div>
                            <hr className="col-12" />
                            <div className="col-12 d-flex flex-wrap">
                                <div className="col-12 d-flex align-items-center justify-content-between">
                                    <label>Task Designators</label>
                                    <button type="button" className="addMoreButton" onClick={() => openModal4(1007)}>
                                        <div className="sign">+</div>
                                        <div className="text">Add Designator</div>
                                    </button>
                                </div>
                                <div className="col-12 d-flex flex-wrap gap-3">
                                    {(selectedDesignators.length > 0) && (selectedDesignators.map((el, index) => {
                                        return (
                                            <button type="button" className="btn addBtn d-flex align-items-center gap-3" key={index}>
                                                <p>{el.designator_name}</p>
                                                <FontAwesomeIcon icon={faX} onClick={() => removeSelectedDesignator(el.designator_id)} />
                                            </button>
                                        )
                                    })
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}