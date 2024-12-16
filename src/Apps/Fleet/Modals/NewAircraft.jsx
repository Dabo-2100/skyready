import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useManufacturers, useAircraftStatus, useAircraftModels, useAircraftUsages, formCheck } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function NewAircraft() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { closeModal, openModal2, refresh, refreshIndex } = useContext(HomeContext);
    const new_aircraft_sn = useRef();
    const new_register_no = useRef();
    const new_status_id = useRef();
    const new_manufacturer_id = useRef();
    const new_usage_id = useRef();
    const new_model_id = useRef();
    const new_date = useRef();
    const new_flight_hrs = useRef();

    const handleChange = () => {
        if (event.target.value > 1000) {
            openModal2(+event.target.value);
            event.target.value = 0;
        }
    }
    const [manufacturers, setManufacturers] = useState([]);
    const [aircraftStatus, setAircraftStatus] = useState([]);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [aircraftUsages, setAircraftUsages] = useState([]);

    const handleSubmit = () => {
        event.preventDefault();
        let obj = {
            aircraft_serial_no: new_aircraft_sn.current.value,
            aircraft_register_no: new_register_no.current.value,
            model_id: new_model_id.current.value,
            manufacturer_id: new_manufacturer_id.current.value,
            status_id: new_status_id.current.value,
            usage_id: new_usage_id.current.value,
            aircraft_manufacture_date: new_date.current.value,
            aircraft_flight_hours: new_flight_hrs.current.value,
        }
        let formErrors = formCheck([
            { value: new_aircraft_sn.current.value, options: { required: true } },
            { value: new_register_no.current.value, options: { required: true } },
            { value: new_model_id.current.value, options: { required: true, notEqual: -1 } },
            { value: new_status_id.current.value, options: { required: true, notEqual: -1 } },
            { value: new_manufacturer_id.current.value, options: { required: true, notEqual: -1 } },
            { value: new_usage_id.current.value, options: { required: true, notEqual: -1 } },
        ])

        if (formErrors == 0) {
            axios.post(`${serverUrl}/php/index.php/api/aircraft/store`, obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((res) => {
                if (!res.data.err) {
                    Swal.fire({
                        icon: "success",
                        text: "New Aircraft Registered to Your Fleet !",
                        customClass: darkSwal,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        refresh();
                        closeModal();
                    })
                }
                else {
                    Swal.fire({
                        icon: "error",
                        text: res.data.msg.errorInfo[2],
                        customClass: darkSwal,
                        // timer: 1500,
                        // showConfirmButton: false,
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill All Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    useEffect(() => {
        useManufacturers(serverUrl, token).then((res) => { setManufacturers(res) })
        useAircraftStatus(serverUrl, token).then((res) => { setAircraftStatus(res) })
        useAircraftModels(serverUrl, token).then((res) => { setAircraftModels(res) })
        useAircraftUsages(serverUrl, token).then((res) => { setAircraftUsages(res) })
    }, [refreshIndex]);

    return (
        <div className="modal ">
            <div className="content animate__animated animate__fadeIn" onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button className="backButton" onClick={() => { closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                    <h1 className="fs-5">New Aircraft</h1>
                    <button className="saveButton" onClick={handleSubmit}>
                        <div className="svg-wrapper-1"><div className="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path></svg></div></div>
                        <span>Register</span>
                    </button>
                </header>
                <main className="col-12 d-flex flex-wrap">
                    <form className="col-12 d-flex flex-wrap gap-3  justify-content-lg-between" onSubmit={handleSubmit}>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Serial No <span className="text-danger">*</span></label>
                            <input className="col-12 form-control" type="text" id="sn" ref={new_aircraft_sn} placeholder="Enter aircraft serial no" required />
                        </div>

                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="rn">Registration Number <span className="text-danger">*</span></label>
                            <input className="col-12 form-control" type="text" id="rn" ref={new_register_no} placeholder="Enter aircraft Registration Number" required />
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Model <span className="text-danger">*</span></label>
                            <select ref={new_model_id} className="col-12 form-select" onChange={handleChange} required>
                                <option hidden value={-1} >Select aircraft Model</option>
                                {
                                    aircraftModels.map((el, index) => {
                                        return (<option value={el.model_id} key={index}>{el.model_name}</option>)
                                    })
                                }
                                <option value={1004} className="btn addBtn py-2">Add New Model</option>
                            </select>
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Status <span className="text-danger">*</span></label>
                            <select ref={new_status_id} className="col-12 form-select" onChange={handleChange} required>
                                <option hidden value={-1} >Select aircraft Status</option>
                                {
                                    aircraftStatus.map((el, index) => {
                                        return (<option value={el.status_id} key={index}>{el.status_name}</option>)
                                    })
                                }
                                <option value={1003} className="btn addBtn py-2">Add New Status</option>
                            </select>
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Manufacturer <span className="text-danger">*</span></label>
                            <select ref={new_manufacturer_id} className="col-12 form-select" onChange={handleChange} required>
                                <option hidden value={-1}>Select aircraft Manufacturer</option>
                                {
                                    manufacturers.map((el, index) => {
                                        return (<option value={el.manufacturer_id} key={index}>{el.manufacturer_name}</option>)
                                    })
                                }
                                <option value={1002} className="btn addBtn py-2">Add New Manufacturer</option>
                            </select>
                        </div>

                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Usage <span className="text-danger">*</span></label>
                            <select ref={new_usage_id} className="col-12 form-select" onChange={handleChange} required>
                                <option hidden value={-1} >Select aircraft Usage</option>
                                {
                                    aircraftUsages.map((el, index) => {
                                        return (<option value={el.usage_id} key={index}>{el.usage_name}</option>)
                                    })
                                }
                                <option value={1005} className="btn addBtn py-2">Add New Usage</option>
                            </select>
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Manufacturer Date </label>
                            <input className="col-12 form-control" type="date" id="sn" ref={new_date} placeholder="Enter aircraft serial no" required />
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Flight Hours </label>
                            <input className="col-12 form-control" type="text" id="sn" ref={new_flight_hrs} placeholder="Enter aircraft serial no" required />
                        </div>
                    </form>
                </main>
                <footer className="col-12 p-3">
                    <p className="col-12" style={{ fontSize: "0.8rem" }}>All fields with <span className="text-danger">*</span> are required to complete register</p>
                </footer>
            </div>
        </div>
    )
}