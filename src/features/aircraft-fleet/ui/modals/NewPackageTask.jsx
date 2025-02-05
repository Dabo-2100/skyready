import { useEffect, useRef, useState } from "react"
import Select from 'react-select';

import usePackages from "../hooks/usePackages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { setActiveId as setActiveSpeciality, resetActiveId } from "../../state/activeSpecialityIdSlice";
import { resetDesignators } from "../../state/selectedDesignatorsSlice";
import { resetZones } from "../../state/selectedZonesSlice";
import { useDispatch, useSelector } from "react-redux";
import TaskWorkingZone from "../components/TaskWorkingZone";
import TaskWorkingDesignators from "../components/TaskWorkingDesignators";
import useAircraft from "../hooks/useAircraft";
import { setSpecialties } from "../../state/aircraftSpecialtiesSlice";
import { openModal4 } from "../../../../shared/state/modalSlice";
import Modal from "../../../../shared/ui/modals/Modal";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";

export default function NewPackageTask() {
    const dispatch = useDispatch();
    const refreshIndex = useSelector(state => state.home.refreshIndex);
    const active_speciality_id = useSelector(state => state.aircraftFleet.activeSpecialityId.value);
    const active_work_package_id = useSelector(state => state.aircraftFleet.activeWorkPackageId.value);
    const selectedZones = useSelector(state => state.aircraftFleet.selectedZones.value);
    const selectedDesignators = useSelector(state => state.aircraftFleet.selectedDesignators.value);
    const aircraftSpecialties = useSelector(state => state.aircraftFleet.aircraftSpecialties.value);
    const packageInfo = useSelector(state => state.aircraftFleet.activeWorkPackageInfo.value);

    const { getWorkPackageTaskTypes, addNewWorkPackageTask } = usePackages();
    const { getAircraftSpecialties } = useAircraft();

    const [workPackageTaskTypes, setWorkPackageTaskTypes] = useState([]);

    const taskInputs = useRef([]);
    const handleSubmit = () => {
        addNewWorkPackageTask(taskInputs, active_work_package_id, selectedZones, selectedDesignators);
    }

    useEffect(() => {
        getAircraftSpecialties().then((res) => { dispatch(setSpecialties(res)) });
        if (active_speciality_id != 0) {
            getWorkPackageTaskTypes(active_speciality_id).then(setWorkPackageTaskTypes).then(() => {
                taskInputs.current[3].setValue(-1);
            });
        }
        else {
            setWorkPackageTaskTypes([]);
        }
        // eslint-actov
    }, [active_speciality_id, refreshIndex]);

    useEffect(() => {
        return () => {
            dispatch(resetZones());
            dispatch(resetDesignators());
            dispatch(resetActiveId());
        }
    }, [])

    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                <h1 className="fs-5">New Task to : {packageInfo.package_name}</h1>
                <SaveBtn label={"Save"} onClick={handleSubmit} />
            </header>
            <div className="col-12 d-flex flex-wrap p-3 justify-content-lg-between" >
                <div className="col-12 col-lg-6 p-2 inputField">
                    <label className="col-12" htmlFor="sn">Task Name <span className="text-danger">*</span></label>
                    <input className="col-12 form-control" type="text" id="sn" ref={el => { taskInputs.current[0] = el }} placeholder="Enter New Task Name" required />
                </div>
                <div className="col-12 col-lg-6 p-2 inputField">
                    <label className="col-12" htmlFor="rn">Task Duration <span className="text-danger">*</span></label>
                    <input className="col-12 form-control" type="number" id="rn" ref={el => { taskInputs.current[1] = el }} placeholder="Enter Task Duration" required />
                </div>
                <div className="col-12 col-lg-6 p-2 inputField">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                        <label htmlFor="sn">Specialty <span className="text-danger">*</span></label>
                        <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => dispatch(openModal4(5000))} icon={faGears} />
                    </div>
                    <select ref={el => { taskInputs.current[2] = el }} className="col-12 form-select" onChange={() => dispatch(setActiveSpeciality(event.target.value))} required>
                        <option hidden value={-1}>Select Specialty</option>
                        {
                            aircraftSpecialties.map((el, index) => {
                                return (<option value={el.specialty_id} key={index}>{el.specialty_name}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="col-12 col-lg-6 p-2 inputField">
                    {
                        (taskInputs.current[2] && taskInputs.current[2].value != -1) && (
                            <>
                                <div className="col-12 d-flex align-items-center justify-content-between">
                                    <label htmlFor="sn">Task Type <span className="text-danger">*</span></label>
                                    <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => dispatch(openModal4(4004))} icon={faGears} />
                                </div>
                                <Select
                                    ref={el => { taskInputs.current[3] = el }}
                                    className="col-12"
                                    options={workPackageTaskTypes.map(el => { return { value: el.type_id, label: el.type_name } })}
                                />
                            </>
                        )
                    }

                </div>
                <div className="col-12 col-lg-6 p-2 inputField">
                    <label htmlFor="">Task Description</label>
                    <textarea ref={el => { taskInputs.current[4] = el }} className="form-control"></textarea>
                </div>
                <hr className="col-12" />
                <TaskWorkingZone />
                <hr className="col-12" />
                <TaskWorkingDesignators />
            </div>
        </Modal>
    )
}