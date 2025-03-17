import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react"

import useAircraft from "../hooks/useAircraft";
import { openModal2 } from "../../../../shared/state/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../../../shared/ui/modals/Modal";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";
export default function NewAircraft() {

    const dispatch = useDispatch();
    const { addNewAircraftToFleet } = useAircraft();
    const formInputs = useRef([]);

    const manufacturers = useSelector(state => state.aircraftFleet.aircraftManufacturers.value);
    const aircraftStatus = useSelector(state => state.aircraftFleet.aircraftStatus.value);
    const aircraftModels = useSelector(state => state.aircraftFleet.aircraftModels.value);
    const aircraftUsages = useSelector(state => state.aircraftFleet.aircraftUsages.value);

    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                <h1 className="fs-5">New Aircraft</h1>
                <SaveBtn label="Register" onClick={() => addNewAircraftToFleet(formInputs)} />
            </header>
            <main className="col-12 d-flex flex-wrap">
                <div className="col-12 d-flex flex-wrap gap-3  justify-content-lg-between">
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sn">Serial No <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="text" id="sn" ref={el => { formInputs.current[0] = el }} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="rn">Registration Number <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="text" id="rn" ref={el => { formInputs.current[1] = el }} placeholder="Enter aircraft Registration Number" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">

                        <div className="col-12 d-flex align-items-center justify-content-between">
                            <label htmlFor="sn">Model <span className="text-danger">*</span></label>
                            <button className="btn addBtn" onClick={() => dispatch(openModal2(1004))}><FontAwesomeIcon icon={faGears} /></button>
                        </div>

                        <select ref={el => { formInputs.current[5] = el }} className="col-12 form-select" required>
                            <option hidden value={-1} >Select aircraft Model</option>
                            {
                                aircraftModels.map((el, index) => {
                                    return (<option value={el.model_id} key={index}>{el.model_name}</option>)
                                })
                            }
                        </select>
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <div className="d-flex col-12 align-items-center justify-content-between">
                            <label htmlFor="sn">Status <span className="text-danger">*</span></label>
                            <button className="btn addBtn" onClick={() => dispatch(openModal2(1003))}><FontAwesomeIcon icon={faGears} /></button>

                        </div>
                        <select ref={el => { formInputs.current[2] = el }} className="col-12 form-select" required>
                            <option hidden value={-1} >Select aircraft Status</option>
                            {
                                aircraftStatus.map((el, index) => {
                                    return (<option value={el.status_id} key={index}>{el.status_name}</option>)
                                })
                            }
                        </select>
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <div className="d-flex col-12 align-items-center justify-content-between">
                            <label htmlFor="sn">Manufacturer <span className="text-danger">*</span></label>
                            <button className="btn addBtn" onClick={() => dispatch(openModal2(1002))}><FontAwesomeIcon icon={faGears} /></button>
                        </div>
                        <select ref={el => { formInputs.current[3] = el }} className="col-12 form-select" required>
                            <option hidden value={-1}>Select aircraft Manufacturer</option>
                            {
                                manufacturers.map((el, index) => {
                                    return (<option value={el.manufacturer_id} key={index}>{el.manufacturer_name}</option>)
                                })
                            }
                        </select>
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <div className="d-flex col-12 align-items-center justify-content-between">
                            <label htmlFor="sn">Usage <span className="text-danger">*</span></label>
                            <button className="btn addBtn" onClick={() => dispatch(openModal2(1005))}><FontAwesomeIcon icon={faGears} /></button>
                        </div>
                        <select ref={el => { formInputs.current[4] = el }} className="col-12 form-select" required>
                            <option hidden value={-1} >Select aircraft Usage</option>
                            {
                                aircraftUsages.map((el, index) => {
                                    return (<option value={el.usage_id} key={index}>{el.usage_name}</option>)
                                })
                            }
                        </select>
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sn">Manufacturer Date </label>
                        <input className="col-12 form-control" type="date" id="sn" ref={el => { formInputs.current[6] = el }} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sn">Flight Hours </label>
                        <input className="col-12 form-control" type="text" id="sn" ref={el => { formInputs.current[7] = el }} placeholder="Enter aircraft serial no" required />
                    </div>
                </div>
            </main>
            <footer className="col-12 p-3">
                <p className="col-12" style={{ fontSize: "0.8rem" }}>All fields with <span className="text-danger">*</span> are required to complete register</p>
            </footer>
        </Modal>
    )
}