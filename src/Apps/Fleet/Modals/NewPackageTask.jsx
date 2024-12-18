import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { HomeContext } from "@/Pages/HomePage/HomeContext";
import Select from 'react-select';
import { faGears, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWorkPackage from "../../../Hooks/useWorkPackage";
import useNewPackageTask from "../../../Hooks/useNewPackageTask";
import SaveBtn from "../../Warehouse/UI/Components/SaveBtn";
import Modal from "../../Warehouse/UI/Modals/Modal";

export default function NewPackageTask() {
    const { opendPackageInfo, taskTypes: fetchTaskTyes, specialties: fetchSpecialties } = useWorkPackage();
    const { handleSubmit } = useNewPackageTask();
    const { openModal4, refreshIndex } = useContext(HomeContext);
    const { setSpecialty_id, selectedZones, setSelectedZones, selectedDesignators, setSelectedDesignators, removeSelectedZone, removeSelectedDesignator } = useContext(FleetContext);
    const taskInputs = useRef([]);
    const [specialties, setSpecialties] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [packageInfo, setPackageInfo] = useState({ package_name: "" });

    const handleChange = () => {
        setSpecialty_id(event.target.value);
        fetchTaskTyes(event.target.value).then(setTaskTypes)
    }

    useEffect(() => {
        opendPackageInfo().then(setPackageInfo);
        if (taskInputs.current[2] && taskInputs.current[2].value != -1) {
            fetchTaskTyes(taskInputs.current[2].value).then(setTaskTypes);
        } else {
            taskInputs.current[2].value = -1;
            setTaskTypes([]);
            fetchSpecialties().then(setSpecialties);
        }
    }, [refreshIndex]);

    useEffect(() => {
        return () => { setSelectedZones([]); setSelectedDesignators([]); }
    }, [])

    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                <h1 className="fs-5">New Task to : {packageInfo.package_name}</h1>
                <SaveBtn label={"Save"} onClick={() => { event.preventDefault(); handleSubmit(taskInputs) }} />
            </header>
            <form className="col-12 d-flex flex-wrap gap-3 p-3 justify-content-lg-between" >
                <div className="col-12 col-lg-5 inputField">
                    <label className="col-12" htmlFor="sn">Task Name <span className="text-danger">*</span></label>
                    <input className="col-12 form-control" type="text" id="sn" ref={el => { taskInputs.current[0] = el }} placeholder="Enter New Task Name" required />
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <label className="col-12" htmlFor="rn">Task Duration <span className="text-danger">*</span></label>
                    <input className="col-12 form-control" type="number" id="rn" ref={el => { taskInputs.current[1] = el }} placeholder="Enter Task Duration" required />
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                        <label htmlFor="sn">Specialty <span className="text-danger">*</span></label>
                        <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => openModal4(5000)} icon={faGears} />
                    </div>
                    <select ref={el => { taskInputs.current[2] = el }} className="col-12 form-select" onChange={() => handleChange(1)} required>
                        <option hidden value={-1} >Select Specialty</option>
                        {
                            specialties.map((el, index) => {
                                return (<option value={el.specialty_id} key={index}>{el.specialty_name}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="col-12 col-lg-5 inputField">
                    {
                        (taskInputs.current[2] && taskInputs.current[2].value != -1) && (
                            <>
                                <div className="col-12 d-flex align-items-center justify-content-between">
                                    <label htmlFor="sn">Task Type <span className="text-danger">*</span></label>
                                    <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => openModal4(4004)} icon={faGears} />
                                </div>
                                <Select
                                    ref={el => { taskInputs.current[3] = el }}
                                    className="col-12"
                                    options={taskTypes.map(el => { return { value: el.type_id, label: el.type_name } })}
                                />
                            </>
                        )
                    }

                </div>
                <div className="col-12 col-lg-5 inputField">
                    <label htmlFor="">Task Description</label>
                    <textarea ref={el => { taskInputs.current[4] = el }} className="form-control"></textarea>
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
        </Modal>
    )
}