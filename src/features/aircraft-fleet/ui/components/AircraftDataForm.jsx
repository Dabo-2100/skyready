import { faGears } from '@fortawesome/free-solid-svg-icons'
import useAircraftData from '../hooks/useAircraftData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAircraft from '../hooks/useAircraft';
import { useContext, useEffect, useRef, useState } from 'react';
import SaveBtn from '../../../../Apps/Warehouse/UI/Components/SaveBtn';
import { HomeContext } from '../../../../Pages/HomePage/HomeContext';

export default function AircraftDataForm() {
    const { aircraftStatus, manufacturers, aircraftUsages, aircraftInfo, aircraftModels } = useAircraftData();
    const { openModal2, refreshIndex } = useContext(HomeContext);
    const { updateAircraftInfo } = useAircraft();
    const formInputs = useRef([]);
    const [editIndex, setEditIndex] = useState(false);
    useEffect(() => {
        formInputs.current[2].value = aircraftInfo.status_id;
        formInputs.current[3].value = aircraftInfo.manufacturer_id;
        formInputs.current[4].value = aircraftInfo.usage_id;
        formInputs.current[5].value = aircraftInfo.model_id;
    }, [refreshIndex])

    return (
        <main className="col-12 d-flex flex-wrap p-0">
            <div className="col-12 d-flex justify-content-end mb-2">
                {
                    !editIndex ?
                        (
                            <div className="editBtn" onClick={() => setEditIndex(!editIndex)}>
                                <button className="editButton">Edit
                                    <svg viewBox="0 0 512 512" className="svg"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                </button>
                            </div>
                        ) : (
                            <SaveBtn label="Save" onClick={() => { updateAircraftInfo(formInputs) }} />
                        )
                }
            </div>
            <div className="col-12 d-flex flex-wrap gap-3 pb-3 justify-content-lg-between">
                <div className="col-12 col-lg-5 inputField">
                    <label className="col-12" htmlFor="sn">Serial No</label>
                    <input disabled={!editIndex} defaultValue={aircraftInfo.aircraft_serial_no} className="col-12 form-control" type="text" id="sn" ref={el => { formInputs.current[0] = el }} placeholder="Enter aircraft serial no" />
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <label className="col-12" htmlFor="rn">Registration Number</label>
                    <input disabled={!editIndex} defaultValue={aircraftInfo.aircraft_register_no} className="col-12 form-control" type="text" id="rn" ref={el => { formInputs.current[1] = el }} placeholder="Enter aircraft Registration Number" />
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <div className="d-flex col-12 align-items-center justify-content-between">
                        <label htmlFor="sn">Manufacturer</label>
                        <FontAwesomeIcon icon={faGears} className="btn addBtn" onClick={() => openModal2(1002)} />
                    </div>
                    <select disabled={!editIndex} ref={el => { formInputs.current[3] = el }} className="col-12 form-select" >
                        {
                            manufacturers.map((el, index) => {
                                return (<option value={el.manufacturer_id} key={index}>{el.manufacturer_name}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="col-12 col-lg-5 inputField">

                    <div className="d-flex col-12 align-items-center justify-content-between">
                        <label htmlFor="sn">Status</label>
                        <FontAwesomeIcon icon={faGears} className="btn addBtn" onClick={() => openModal2(1003)} />
                    </div>

                    <select disabled={!editIndex} ref={el => { formInputs.current[2] = el }} className="col-12 form-select" >
                        {
                            aircraftStatus.map((el, index) => {
                                return (<option value={el.status_id} key={index}>{el.status_name}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <div className="d-flex col-12 align-items-center justify-content-between">
                        <label htmlFor="sn">Model</label>
                        <FontAwesomeIcon icon={faGears} className="btn addBtn" onClick={() => openModal2(1004)} />
                    </div>
                    <select disabled={!editIndex} ref={el => { formInputs.current[5] = el }} className="col-12 form-select" >
                        {
                            aircraftModels.map((el, index) => {
                                return (<option value={el.model_id} key={index}>{el.model_name}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <div className="d-flex col-12 align-items-center justify-content-between">
                        <label htmlFor="sn">Usage</label>
                        <FontAwesomeIcon icon={faGears} className="btn addBtn" onClick={() => openModal2(1005)} />
                    </div>
                    <select disabled={!editIndex} ref={el => { formInputs.current[4] = el }} className="col-12 form-select" >
                        {
                            aircraftUsages.map((el, index) => {
                                return (<option value={+el.usage_id} key={index}>{el.usage_name}</option>)
                            })
                        }
                    </select>
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <label className="col-12" htmlFor="sn">Manufacturer Date </label>
                    <input disabled={!editIndex} defaultValue={aircraftInfo.aircraft_manufacture_date} className="col-12 form-control" type="date" id="sn" ref={el => { formInputs.current[6] = el }} placeholder="Enter aircraft serial no" />
                </div>
                <div className="col-12 col-lg-5 inputField">
                    <label className="col-12" htmlFor="sn">Flight Hours </label>
                    <input disabled={!editIndex} defaultValue={aircraftInfo.aircraft_flight_hours} className="col-12 form-control" type="text" id="sn" ref={el => { formInputs.current[7] = el }} placeholder="Enter aircraft serial no" />
                </div>
            </div>
        </main>
    )
}



