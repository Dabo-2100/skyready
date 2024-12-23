import { useContext, useEffect, useRef, useState } from "react"
import { ProjectsContext } from "../ProjectContext";
import { useManufacturers, useAircraftStatus, getAircraftByModel, useAircraftModels, useAircraftUsages, formCheck } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import { $LoaderIndex } from "../../../store";
import Modal from "../../Warehouse/UI/Modals/Modal";
import { ModalBody, ModalFooter, ModalHeader } from "react-bootstrap";
import SaveBtn from "../../Warehouse/UI/Components/SaveBtn";

export default function NewProject() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);

    const { closeModal, openModal2, refresh, refreshIndex } = useContext(HomeContext);

    const new_project_name = useRef();
    const new_project_desc = useRef();
    const [model_id, setModel_id] = useState(0)
    const new_aircraft_sn = useRef();
    const start_date = useRef();
    const due_date = useRef();
    const work_start_at = useRef();
    const work_end_at = useRef();
    const [workingDays, setWorkingDays] = useState([]);


    const toggleDay = (id) => {
        let index = workingDays.findIndex((el) => { return el == id });
        let newDays = [...workingDays];
        index == -1 ? newDays.push(id) : newDays.splice(index, 1);
        setWorkingDays(newDays);
    };

    const handleChange = () => {
        if (event.target.value > 1000) {
            openModal2(+event.target.value);
            event.target.value = 0;
        }
    }

    const [aircraft, setAircraft] = useState([]);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [weekDays] = useState([
        { id: 0, name: "Sun" },
        { id: 1, name: "Mon" },
        { id: 2, name: "Tus" },
        { id: 3, name: "Wed" },
        { id: 4, name: "Thr" },
        { id: 5, name: "Fri" },
        { id: 6, name: "Sat" },
    ])

    const handleSubmit = () => {
        event.preventDefault();
        let obj = {
            project_name: new_project_name.current.value,
            project_desc: new_project_desc.current.value,
            status_id: 2,
            aircraft_id: new_aircraft_sn.current.value,
            project_start_date: start_date.current.value,
            project_due_date: due_date.current.value,
            work_start_at: work_start_at.current.value,
            work_end_at: work_end_at.current.value,
            working_days: workingDays.toString(),
        }
        let formErrors = formCheck([
            { value: new_project_name.current.value, options: { required: true } },
            { value: new_aircraft_sn.current.value, options: { required: true, notEqual: -1 } },
            { value: start_date.current.value, options: { required: true, notEqual: -1 } },
            { value: due_date.current.value, options: { required: true, greaterThan: start_date.current.value } },
            { value: work_start_at.current.value, options: { required: true, notEqual: -1 } },
            { value: work_end_at.current.value, options: { required: true, notEqual: -1 } },
            { value: workingDays, options: { arrayNotEmpty: true } },
        ])

        if (formErrors == 0) {
            axios.post(`${serverUrl}/php/index.php/api/projects/store`, obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((res) => {
                if (!res.data.err) {
                    setLoaderIndex(true);
                    Swal.fire({
                        icon: "success",
                        text: "New Project Added Successfully Registered to Your Fleet !",
                        customClass: darkSwal,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        setLoaderIndex(false);
                        closeModal();
                    })
                }
                else {
                    Swal.fire({
                        icon: "error",
                        text: res.data.msg.errorInfo[2],
                        customClass: darkSwal,
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
        useAircraftModels(serverUrl, token).then((res) => { setAircraftModels(res) })
    }, [refreshIndex]);

    useEffect(() => {
        if (model_id > 0) {
            getAircraftByModel(serverUrl, token, model_id).then((res) => { setAircraft(res) })
        }
    }, [model_id]);

    return (
        <Modal>
            <div className="col-12 d-flex align-items-center justify-content-between">
                <h5 className="mb-0">New Project</h5>
                <SaveBtn label={'Add Project'} onClick={handleSubmit} />
            </div>
            <div className="col-12 d-flex">
                <form className="col-12 d-flex flex-wrap gap-3  justify-content-lg-between" onSubmit={handleSubmit}>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sn">Project Name <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="text" id="sn" ref={new_project_name} placeholder="Enter Project Name" required />
                    </div>

                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="rn">Project Description<span className="text-danger">*</span></label>
                        <textarea className="col-12 form-control" type="text" id="rn" ref={new_project_desc} placeholder="Enter Project Description" required />
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
                                <option hidden value={-1}>Select aircraft S/N</option>
                                <select ref={new_aircraft_sn} className="col-12 form-select" required>
                                    {
                                        aircraft.map((el, index) => {
                                            return (<option value={el.aircraft_id} key={el.aircraft_id}>{el.aircraft_serial_no}</option>)
                                        })
                                    }
                                </select>
                            </div>
                        )
                    }

                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="sd">Start Date </label>
                        <input className="col-12 form-control" type="date" id="sd" ref={start_date} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="dd">Due Date </label>
                        <input className="col-12 form-control" type="date" id="dd" ref={due_date} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="ws">Work Start At <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="time" id="ws" ref={work_start_at} placeholder="Enter aircraft serial no" required />
                    </div>
                    <div className="col-12 col-lg-5 inputField">
                        <label className="col-12" htmlFor="we">Work Ent At <span className="text-danger">*</span></label>
                        <input className="col-12 form-control" type="time" id="we" ref={work_end_at} placeholder="Enter aircraft serial no" required />
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
                </form>
            </div>
            <div className="col-12 d-flex">
                <p className="col-12" style={{ fontSize: "0.8rem" }}>All fields with <span className="text-danger">*</span> are required to complete register</p>
            </div>
        </Modal>
    )
}