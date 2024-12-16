import Swal from "sweetalert2";
import { useContext, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { $Server, $Token, $LoaderIndex, $Defaults } from "@/store";
import { ProjectsContext } from "../ProjectContext";
import { useProjectAvilablePackages, usePackageInfo, getDueDate, formCheck, useInsert } from "@/customHooks";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import Modal from "../../Warehouse/UI/Modals/Modal";

export default function StartWorkPackage() {
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const { closeModal } = useContext(HomeContext);
    const { openedProject } = useContext(ProjectsContext);
    const [workPackes, setWorkPackaes] = useState([]);
    const [filterWPs, setFilterWPs] = useState([]);
    const [selectedWP, setSelectedWP] = useState(-1);
    const [projectInfo, setProjectInfo] = useState({});

    const [timesArr, setTimeArr] = useState([]);
    const [dateModalIndex, setDateModalIndex] = useState(false);

    const handleFilter = (event) => {
        let val = (event.target.value) && event.target.value.toLowerCase();
        let res = workPackes.filter((el) => {
            return el.package_name.toLowerCase().includes(val);
        });
        setFilterWPs(res)
    }

    const [startDate, setStartDate] = useState(-1);
    const [startTime, setStartTime] = useState(-1);


    const makeTimeArr = (start, end) => {
        const [startHrs, startMins] = start.split(":").map(Number);
        const [endHrs, endMins] = end.split(":").map(Number);
        const arr = [];
        for (let hour = startHrs; hour <= endHrs; hour++) {
            let finalHour = hour;
            let dayLight = hour >= 12 ? 'PM' : 'AM';
            let minutes = '00';

            if (hour === startHrs) {
                minutes = startMins.toString().padStart(2, '0');
            } else if (hour === endHrs) {
                minutes = endMins.toString().padStart(2, '0');
            }

            if (hour > 12) finalHour -= 12;
            if (finalHour === 0) finalHour = 12;

            arr.push(`${finalHour}:${minutes} ${dayLight}`);
        }
        return arr;
    };

    useEffect(() => {
        useProjectAvilablePackages(serverUrl, token, openedProject).then((res) => {
            setTimeArr(makeTimeArr(res.projectInfo.work_start_at, res.projectInfo.work_end_at))
            setProjectInfo(res.projectInfo)
            setWorkPackaes(res.workPackes);
            setFilterWPs(res.workPackes);
            console.log(workPackes)
        })
    }, []);

    const handelAdd = () => {
        let hasErros = formCheck([
            { value: startDate, options: { notEqual: -1 } },
            { value: startTime, options: { notEqual: -1 } }
        ]);
        if (hasErros > 0) {
            Swal.fire({
                icon: "error",
                text: "Please Fill Time and Date First !",
                timer: 1500
            }).then(() => { setLoaderIndex(0); })
        }
        else {
            setLoaderIndex(1);
            let Time = timesArr[startTime].split(" ")[0];
            let DayLight = timesArr[startTime].split(" ")[1];
            let TimeHrs = Time.split(":")[0] < 12 ? `0${Time.split(":")[0]}` : Time.split(":")[0];
            let TimeMins = Time.split(":")[1];
            if (DayLight == "PM" && TimeHrs != 12) {
                TimeHrs = +TimeHrs + 12;
            }
            let package_start_date = startDate + "T" + TimeHrs + ":" + TimeMins;
            usePackageInfo(serverUrl, token, selectedWP).then((res) => {
                let project_id = projectInfo.project_id;
                let work_start_at = projectInfo.work_start_at;
                let work_end_at = projectInfo.work_end_at;
                let working_days = projectInfo.working_days.split(",").map((el) => +el);
                let tasks = res.tasks;
                let task_start_at = package_start_date;
                let work_package_id = selectedWP;
                let package_info = { work_package_id, project_id, status_id: 1 };
                useInsert(serverUrl, token, "project_work_packages", package_info).then(async () => {
                    for (let task of tasks) {
                        let task_id = task.task_id;
                        let task_duration = task.task_duration;
                        let task_end_at = getDueDate(task_start_at, task_duration, work_start_at, work_end_at, working_days);
                        let obj = { task_id, project_id, task_start_at, task_end_at, status_id: 1 };
                        task_start_at = task_end_at;
                        await useInsert(serverUrl, token, "project_tasks", obj);
                    }
                    Swal.fire({
                        icon: "success",
                        text: "New Work Package Added To Project Successfully !",
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        setLoaderIndex(0);
                        closeModal();
                    })
                })
            })
        }
    }

    useEffect(() => {
        if (dateModalIndex) {
            setStartDate(-1);
            setStartTime(-1);
        }
    }, [dateModalIndex])

    return (
        <Modal>
            <div className={"col-12"}>
                <h5 className="mb-0 text-center col-12 shadow p-2">Applicable Work Packages</h5>
                <div className="col-12 bg-white rounded shadow  px-3 pt-2">
                    <div className="d-flex flex-wrap col-12 align-items-center justify-content-between">
                        <label className="col-12 col-md-3 text-center" htmlFor="sr">Search For Work Package</label>
                        <div className="col-12 col-md-9 d-flex ps-3">
                            <input type="search" id="sr" className="form-control" onChange={handleFilter} />
                        </div>
                    </div>
                    <hr className="col-12" />
                    <table className="table table-bordered table-hover text-center">
                        <thead>
                            <tr>
                                <th>-</th>
                                <th>Work Packge Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filterWPs.map((el, index) => {
                                    return (
                                        <tr
                                            style={{ cursor: 'pointer' }}
                                            key={el.package_id}
                                            // className={el.package_id == selectedWP ? `selectedTask` : null}
                                            onClick={() => { setSelectedWP(el.package_id); setDateModalIndex(true) }}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{el.package_name}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                        <tfoot></tfoot>
                    </table>
                </div>

                {dateModalIndex && (<div className="modal" id="startDateModal">
                    <div className="content d-flex flex-column align-items-center rounded-3 shadow pb-3">
                        <div className="col-12 p-2">
                            <button className="backButton" onClick={() => setDateModalIndex(false)}>
                                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                                <span>Back</span>
                            </button>
                        </div>
                        <div className="col-12 d-flex flex-wrap px-3 gap-3">
                            <h1 className="col-12 fs-5">Select Start Date To This Package</h1>
                            <div className="col-12 d-flex flex-wrap gap-3 align-items-center" >
                                <div className="col-12 col-md-5 d-flex flex-wrap gap-2 pe-2">
                                    <label htmlFor="" className="col-12">Pick Up Start Date</label>
                                    <input className="form-control" type="date" onChange={(event) => setStartDate(event.target.value)} />
                                </div>
                                {
                                    (startDate && startDate != -1) && (
                                        <div className="col-12 col-md-5 d-flex flex-wrap gap-2 ps-2">
                                            <label htmlFor="" className="col-12">Pick Up Start Time</label>
                                            <select className="form-select" onChange={(event) => { setStartTime(event.target.value) }}>
                                                <option value={-1} hidden>Select Start time</option>
                                                {
                                                    timesArr.map((time, index) => {
                                                        return <option key={index} value={index}>{time}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    )
                                }
                            </div>
                            <button className="btn addBtn" onClick={handelAdd}>Add WorkPackage</button>
                        </div>
                    </div>
                </div>)}

            </div>
        </Modal>
    )
}