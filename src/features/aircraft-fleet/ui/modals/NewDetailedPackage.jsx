import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import SaveBtn from "../../../../Apps/Warehouse/UI/Components/SaveBtn";
import { useRef, useState } from "react";
import usePackages from "../hooks/usePackages";
import useAircraft from "../hooks/useAircraft";
import useAircraftData from "../hooks/useAircraftData";
import { useSelector } from "react-redux";


export default function NewDetailedPackage() {
    const activeWorkPackageFolderId = useSelector(state => state.aircraftFleet.activeWorkPackageFolderId.value);
    const activeWorkPackageTypeId = useSelector(state => state.aircraftFleet.activeWorkPackageTypeId.value);

    const formInputs = useRef([]);
    const { addNewDetailedWorkPackage } = usePackages()
    const { getAircraftFleetByModel } = useAircraft();
    const { aircraftModels: models, aircraftFleet: aircraftFleet, setAircraftFleet } = useAircraftData();
    const [selectedApplicablity, setSelectedApplicablity] = useState([]);

    const handleSubmit = () => {
        addNewDetailedWorkPackage(formInputs, selectedApplicablity, activeWorkPackageFolderId, activeWorkPackageTypeId);
    }

    const toggleApp = (aircraft_id) => {
        let oApp = [...selectedApplicablity];
        let index = oApp.findIndex((el) => el.aircraft_id == aircraft_id);
        index == -1 ? oApp.push(aircraftFleet.find(el => el.aircraft_id == aircraft_id)) : oApp.splice(index, 1);
        setSelectedApplicablity(oApp);
    }

    const handleModelChange = (event) => {
        getAircraftFleetByModel(event.target.value).then(setAircraftFleet);
        setSelectedApplicablity([]);
    }

    return (
        <Modal>
            <header className="col-12 m-0 p-0 px-3 pb-2 d-flex flex-wrap justify-content-between align-items-center">
                <h1 className="mb-0 fs-4">Add Detailed Work Package</h1>
                <div className="d-flex gap-3">
                    <SaveBtn label="Save" onClick={handleSubmit} />
                </div>
            </header>
            <main className="col-12 d-flex flex-wrap p-0 m-0">
                <div className="col-12 d-flex flex-wrap">
                    <div className="col-12 col-md-6 p-2 border d-flex flex-wrap align-content-center">
                        <label className="col-12 mb-2">Work Package Name</label>
                        <input ref={el => { formInputs.current[0] = el }} className="form-control" />
                    </div>

                    <div className="col-12 col-md-6 p-2 border">
                        <label className="col-12  mb-2">Release Version</label>
                        <input ref={el => { formInputs.current[2] = el }} type="text" className="form-control" />
                    </div>

                    <div className="col-12 col-md-6 p-2 border">
                        <label className="col-12 mb-2">Release Date</label>
                        <input ref={el => { formInputs.current[3] = el }} type="date" className="form-control" />
                    </div>

                    <div className="col-12 col-md-6 p-2 border">
                        <label className="col-12 mb-2">Issued Duration (HRs)</label>
                        <input ref={el => { formInputs.current[4] = el }} type="number" className="form-control" />
                    </div>

                    <div className="col-12 col-md-6 p-2 border">
                        <label className="col-12  mb-2">Work Package Description</label>
                        <textarea ref={el => { formInputs.current[1] = el }} className="form-control" />
                    </div>

                    <div className="col-12 col-md-6 border d-flex flex-wrap justify-content-between myCheck gap-0">
                        <div className="col-12 p-2 border-bottom d-flex flex-wrap align-content-center mb-3">
                            <label className="col-12 mb-2">Model Name</label>
                            <select
                                ref={el => { formInputs.current[5] = el }}
                                className="form-select"
                                onChange={handleModelChange}
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
                                aircraftFleet.map((el) => {
                                    return (
                                        <div className="d-flex col-6 col-md-4 p-2 gap-2 algin-items-center" key={el.aircraft_id}>
                                            <input
                                                id={`check-${el.aircraft_id}`}
                                                type="checkbox"
                                                onChange={() => toggleApp(el.aircraft_id)}
                                            />
                                            <label htmlFor={`check-${el.aircraft_id}`}>{el.aircraft_serial_no}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </main>
        </Modal>
    )
}