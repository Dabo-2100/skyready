import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useManufacturers, useAircraftStatus, useAircraftModels, useAircraftUsages, useGetData } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function EditAircraft() {
    const { closeModal, openModal2, refresh, refreshIndex } = useContext(HomeContext)
    const { editAircaft_id, setOpenPackage_id } = useContext(FleetContext);
    const new_aircraft_sn = useRef();
    const new_register_no = useRef();
    const new_status_id = useRef();
    const new_manufacturer_id = useRef();
    const new_usage_id = useRef();
    const new_model_id = useRef();
    const new_date = useRef();
    const new_flight_hrs = useRef();

    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [aircraftObj, serAircraftObj] = useState({});
    const [editIndex, setEditIndex] = useState(false);

    const [parts, setParts] = useState([]);

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

    const getData = async () => {
        await axios.get(`${serverUrl}/php/index.php/api/aircraft/${editAircaft_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((res) => {
            if (!res.data.err) {
                let obj = res.data.data[0];
                new_status_id.current.value = obj.status_id;
                new_manufacturer_id.current.value = obj.manufacturer_id;
                new_usage_id.current.value = obj.usage_id;
                new_model_id.current.value = obj.model_id;
                serAircraftObj(obj);
            }
            else {
                serAircraftObj({});
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const getApplicapilty = async () => {
        let q = `SELECT package_id, 
        (SELECT package_name FROM work_packages WHERE package_id = wpa.package_id) AS package_name ,
        (SELECT package_issued_duration FROM work_packages WHERE package_id = wpa.package_id) AS package_issued_duration ,
        (SELECT package_desc FROM work_packages WHERE package_id = wpa.package_id) AS package_desc ,
        (SELECT package_id FROM work_packages WHERE package_id = (SELECT parent_id FROM work_packages WHERE package_id = wpa.package_id)) AS parent_id, 
        (SELECT package_name FROM work_packages WHERE package_id = (SELECT parent_id FROM work_packages WHERE package_id = wpa.package_id)) AS parent_name,
        (SELECT SUM(task_duration) FROM work_package_tasks WHERE package_id = wpa.package_id ) AS estimated_duration 
        FROM work_package_applicability wpa 
        WHERE aircraft_id = ${editAircaft_id}
        ORDER BY parent_name,package_name
        `
        await useGetData(serverUrl, token, q).then((res) => {
            setParts(res);
        })
    }

    useEffect(() => {
        useManufacturers(serverUrl, token).then((res) => {
            setManufacturers(res);
            useAircraftStatus(serverUrl, token).then((res) => {
                setAircraftStatus(res);
                useAircraftModels(serverUrl, token).then((res) => {
                    setAircraftModels(res);
                    useAircraftUsages(serverUrl, token).then((res) => {
                        setAircraftUsages(res);
                        getData();
                    });
                });
            });
        });
        getApplicapilty();
    }, [refreshIndex])

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
        axios.post(`${serverUrl}/php/index.php/api/aircraft/update`,
            {
                table_name: "app_aircraft",
                condition: `aircraft_id = ${editAircaft_id}`,
                data: obj
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((res) => {
            if (!res.data.err) {
                Swal.fire({
                    icon: "success",
                    text: "Aircraft Data Updated Successfully !",
                    customClass: darkSwal,
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    closeModal();
                    refresh();
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

    return (
        <div className="modal" id="AircraftInfo">
            <div className="content text-dark pb-3 container animate__animated animate__fadeIn" onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button className="backButton" onClick={() => { closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>

                <div className="accordion" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                <h6 className="p-0 m-0">Aircraft Data</h6>
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <main className="col-12 d-flex flex-wrap p-0">
                                    <div className="col-12 d-flex justify-content-end mb-2">
                                        {
                                            !editIndex ?
                                                (
                                                    <div className="editBtn" onClick={() => setEditIndex(!editIndex)}>
                                                        <button className="editButton">Edit
                                                            <svg viewBox="0 0 512 512" className="svg"> <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="saveBtn" onClick={handleSubmit}>
                                                        <button className="saveButton">
                                                            <div className="svg-wrapper-1">
                                                                <div className="svg-wrapper">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon">
                                                                        <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <span>Save</span>
                                                        </button>
                                                    </div>
                                                )
                                        }
                                    </div>
                                    <form className="col-12 d-flex flex-wrap gap-3 pb-3 justify-content-lg-between" onSubmit={handleSubmit}>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="sn">Serial No</label>
                                            <input disabled={!editIndex} defaultValue={aircraftObj.aircraft_serial_no} className="col-12 form-control" type="text" id="sn" ref={new_aircraft_sn} placeholder="Enter aircraft serial no" required />
                                        </div>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="rn">Registration Number</label>
                                            <input disabled={!editIndex} defaultValue={aircraftObj.aircraft_register_no} className="col-12 form-control" type="text" id="rn" ref={new_register_no} placeholder="Enter aircraft Registration Number" required />
                                        </div>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="sn">Manufacturer</label>
                                            <select disabled={!editIndex} ref={new_manufacturer_id} className="col-12 form-select" onChange={handleChange} required>
                                                {
                                                    manufacturers.map((el, index) => {
                                                        return (<option value={el.manufacturer_id} key={index}>{el.manufacturer_name}</option>)
                                                    })
                                                }
                                                <option value={1002} className="btn addBtn py-2">Add New Manufacturer</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="sn">Status</label>
                                            <select disabled={!editIndex} ref={new_status_id} className="col-12 form-select" onChange={handleChange} required>
                                                {
                                                    aircraftStatus.map((el, index) => {
                                                        return (<option value={el.status_id} key={index}>{el.status_name}</option>)
                                                    })
                                                }
                                                <option value={1003} className="btn addBtn py-2">Add New Status</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="sn">Model</label>
                                            <select disabled={!editIndex} ref={new_model_id} className="col-12 form-select" onChange={handleChange} required>
                                                {
                                                    aircraftModels.map((el, index) => {
                                                        return (<option value={el.model_id} key={index}>{el.model_name}</option>)
                                                    })
                                                }
                                                <option value={1004} className="btn addBtn py-2">Add New Model</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="sn">Usage</label>
                                            <select disabled={!editIndex} ref={new_usage_id} className="col-12 form-select" onChange={handleChange} required>
                                                {
                                                    aircraftUsages.map((el, index) => {
                                                        return (<option value={+el.usage_id} key={index}>{el.usage_name}</option>)
                                                    })
                                                }
                                                <option value={1005} className="btn addBtn py-2">Add New Usage</option>
                                            </select>
                                        </div>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="sn">Manufacturer Date </label>
                                            <input disabled={!editIndex} defaultValue={aircraftObj.aircraft_manufacture_date} className="col-12 form-control" type="date" id="sn" ref={new_date} placeholder="Enter aircraft serial no" required />
                                        </div>
                                        <div className="col-12 col-lg-5 inputField">
                                            <label className="col-12" htmlFor="sn">Flight Hours </label>
                                            <input disabled={!editIndex} defaultValue={aircraftObj.aircraft_flight_hours} className="col-12 form-control" type="text" id="sn" ref={new_flight_hrs} placeholder="Enter aircraft serial no" required />
                                        </div>
                                    </form>
                                </main>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                                <h6 className="p-0 m-0">Applicable Work Packages</h6>
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <table className="table table-bordered text-center table-hover">
                                    <thead>
                                        <tr>
                                            <th>-</th>
                                            <th className="col-3">Package Name</th>
                                            <th>Package Description</th>
                                            <th>Issued Duration</th>
                                            <th>Estimated Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parts.map((el, index) => {
                                            return (
                                                <tr key={el.package_id} onClick={() => { setOpenPackage_id(el.package_id); openModal2(4002); }}>
                                                    <td>{index + 1}</td>
                                                    <td>{el.parent_name && `${el.parent_name}  |`} {el.package_name}</td>
                                                    <td> {el.package_desc}</td>
                                                    <td> {el.package_issued_duration}</td>
                                                    <td> {el.estimated_duration && el.estimated_duration.toFixed(1)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}