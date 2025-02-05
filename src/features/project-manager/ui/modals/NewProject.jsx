
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import SaveBtn from "../../../../Apps/Warehouse/UI/Components/SaveBtn";
import { setAircraftFleet } from "../../../aircraft-fleet/state/aircraftFleetSlice";
import useAircraft from "../../../aircraft-fleet/ui/hooks/useAircraft";
import useProjects from "../hooks/useProjects";
import { setAircraftModels } from "../../../aircraft-fleet/state/aircraftModelsSlice";

export default function NewProject() {
    const dispatch = useDispatch();
    const aircraft = useSelector(state => state.aircraftFleet.aircraftFleet.value);
    const aircraftModels = useSelector(state => state.aircraftFleet.aircraftModels.value);
    const { getAircraftFleetByModel, getAircraftModels } = useAircraft();
    const { createNewProject } = useProjects();
    const formInputs = useRef([]);
    const [model_id, setModel_id] = useState(0)
    const [workingDays, setWorkingDays] = useState([]);
    const [weekDays] = useState([
        { id: 0, name: "Sun" },
        { id: 1, name: "Mon" },
        { id: 2, name: "Tus" },
        { id: 3, name: "Wed" },
        { id: 4, name: "Thr" },
        { id: 5, name: "Fri" },
        { id: 6, name: "Sat" },
    ])

    const toggleDay = (id) => {
        let index = workingDays.findIndex((el) => { return el == id });
        let newDays = [...workingDays];
        index == -1 ? newDays.push(id) : newDays.splice(index, 1);
        setWorkingDays(newDays);
    };

    const handleSubmit = () => {
        createNewProject(formInputs, workingDays);
    }

    useEffect(() => {
        if (aircraftModels.length == 0) {
            getAircraftModels().then((res) => { dispatch(setAircraftModels(res)) })
        }
        // eslint-disable-next-line
    }, [aircraftModels])

    useEffect(() => {
        if (model_id > 0) {
            getAircraftFleetByModel(model_id).then((res) => dispatch(setAircraftFleet(res)))
        }
        // eslint-disable-next-line
    }, [model_id]);

    return (
        <Modal>
            <div className="col-12 d-flex align-items-center justify-content-between p-3">
                <h5 className="mb-0">New Project</h5>
                <SaveBtn label={'Add Project'} onClick={handleSubmit} />
            </div>
            <div className="col-12 d-flex p-3">
                <div className="col-12 d-flex flex-wrap gap-3  justify-content-lg-between">
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sn">Project Name <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="text" id="sn" ref={(event) => { formInputs.current[0] = event }} placeholder="Enter Project Name" required />
                    </div>

                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="rn">Project Description<span className="text-danger">*</span></label>
                        <textarea className="col-12 form-control" type="text" id="rn" ref={(event) => { formInputs.current[1] = event }} placeholder="Enter Project Description" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sn">A/C Model <span className="text-danger">*</span></label>
                        <select className="col-12 form-select" onChange={(event) => setModel_id(event.target.value)} required>
                            <option hidden value={-1} >Select aircraft Model</option>
                            {
                                aircraftModels.map((el, index) => {
                                    return (<option value={el.model_id} key={index}>{el.model_name}</option>)
                                })
                            }
                        </select>
                    </div>
                    {
                        (model_id > 0) && (
                            <div className="col-12 col-lg-5 inputField">
                                <label className="col-12" htmlFor="sn">A/C Serial No <span className="text-danger">*</span></label>

                                <select ref={(event) => { formInputs.current[2] = event }} className="col-12 form-select" required>
                                    <option hidden value={-1}>Select aircraft S/N</option>
                                    {
                                        aircraft.map((el) => {
                                            return (<option value={el.aircraft_id} key={el.aircraft_id}>{el.aircraft_serial_no}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        )
                    }

                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sd">Start Date </label>
                        <input className="col-12 form-control" type="date" id="sd" ref={(event) => { formInputs.current[3] = event }} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="dd">Due Date </label>
                        <input className="col-12 form-control" type="date" id="dd" ref={(event) => { formInputs.current[4] = event }} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="ws">Work Start At <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="time" id="ws" ref={(event) => { formInputs.current[5] = event }} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="we">Work Ent At <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="time" id="we" ref={(event) => { formInputs.current[6] = event }} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="wd">Working Days <span className="text-danger">*</span></label>
                        <div className="col-12 d-flex justify-content-between">
                            {
                                weekDays.map((d) => {
                                    return (
                                        <button type="button" key={d.id} onClick={() => toggleDay(d.id)} className={`btn ${workingDays.findIndex((el) => { return el == d.id }) == -1 ? 'btn-secondary' : 'btn-primary'}`}>{d.name}</button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex">
                <p className="col-12" style={{ fontSize: "0.8rem" }}>All fields with <span className="text-danger">*</span> are required to complete register</p>
            </div>
        </Modal>
    )
}