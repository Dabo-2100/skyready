
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useProjects from "../hooks/useProjects";
import Modal from "../../../../shared/ui/modals/Modal";
import CloseBtn from "../../../../shared/ui/components/CloseBtn/CloseBtn";
import { useLoader } from "../../../../store-zustand";

export default function StartWorkPackage() {
    const { setLoaderIndex } = useLoader();
    const { startWorkPackage } = useProjects();
    const projectInfo = useSelector(state => state.projects.activeProject.info);
    const workPakcages = useSelector(state => state.projects.activeProject.availablePackages);
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const [filterWPs, setFilterWPs] = useState([]);
    const [selectedWP, setSelectedWP] = useState(-1);
    const [timesArr, setTimeArr] = useState([]);
    const [dateModalIndex, setDateModalIndex] = useState(false);
    const [startDate, setStartDate] = useState(-1);
    const [startTimeIndex, startTimeIndexIndex] = useState(-1);

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
        setFilterWPs(workPakcages);
        setTimeArr(makeTimeArr(projectInfo.work_start_at, projectInfo.work_end_at));
        // eslint-disable-next-line
    }, [refreshIndex]);

    const handleFilter = (event) => {
        let val = (event.target.value) && event.target.value.toLowerCase();
        let res = workPakcages.filter((el) => {
            return el.package_name.toLowerCase().includes(val);
        });
        setFilterWPs(res)
    }

    const handelAdd = () => {
        setLoaderIndex(true);
        let project_id = projectInfo.project_id;
        let Time = timesArr[startTimeIndex].split(" ")[0];
        let DayLight = timesArr[startTimeIndex].split(" ")[1];
        let TimeHrs = Time.split(":")[0] < 12 ? `0${Time.split(":")[0]}` : Time.split(":")[0];
        let TimeMins = Time.split(":")[1];
        if (DayLight == "PM" && TimeHrs != 12) {
            TimeHrs = +TimeHrs + 12;
        }
        let package_start_date = startDate + "T" + TimeHrs + ":" + TimeMins;
        startWorkPackage(package_start_date, selectedWP, project_id).then(() => { setTimeout(() => { setLoaderIndex(false) }, 500) });
    }

    useEffect(() => {
        if (dateModalIndex) { setStartDate(-1); startTimeIndexIndex(-1); }
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

                {dateModalIndex &&
                    <div className="modal" id="startDateModal">
                        <div className="d-flex flex-column p-3 bg-white rounded-3 border shadow col-12 col-md-5 animate__animated animate__fadeInDown">
                            <div className="col-12 p-2">
                                <CloseBtn label={"Back"} onClick={() => setDateModalIndex(false)} />
                            </div>
                            <div className="col-12 d-flex flex-wrap px-3 gap-3">
                                <div className="col-12 d-flex flex-column gap-3 align-items-center" >
                                    <div className="col-12 d-flex flex-column gap-2 pe-2">
                                        <label htmlFor="" className="col-12">Pick Up Start Date</label>
                                        <input className="form-control" type="date" onChange={(event) => setStartDate(event.target.value)} />
                                    </div>
                                    {
                                        (startDate && startDate != -1) && (
                                            <div className="col-12 d-flex flex-column gap-2 ps-2">
                                                <label htmlFor="" className="col-12">Pick Up Start Time</label>
                                                <select className="form-select" onChange={(event) => { startTimeIndexIndex(event.target.value) }}>
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
                                <button className="btn addBtn col-12" onClick={handelAdd}>Add WorkPackage</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </Modal>
    )
}