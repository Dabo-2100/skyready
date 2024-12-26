import { faAdd, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { FleetContext } from "../FleetContext";
import { useSpecialties } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function Specialties() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [specialties, setSpecialties] = useState([]);
    const { openModal, refreshIndex } = useContext(HomeContext);

    useEffect(() => {
        useSpecialties(serverUrl, token).then(res => setSpecialties(res))
    }, [refreshIndex])

    return (
        <div className="col-12 d-flex flex-wrap p-3 Tab" id="specialtiesTab">
            <div className="col-12 p-3 content rounded-4">
                <div className="col-12 actions pb-3 d-flex align-items-center justify-content-between">
                    <p className="fs-6 text-secondary">Specalties List</p>
                    <div className="d-flex align-items-center gap-3">
                        <FontAwesomeIcon className="filterIcon p-2 rounded-2" icon={faFilter} />
                        <button className="btn btn-danger addBtn" onClick={() => { openModal(5000) }}><FontAwesomeIcon icon={faAdd} /> Add Specialty</button>
                    </div>
                </div>
                <table className="col-12 table table-bordered m-0 table-dark text-center table-hover">
                    <thead>
                        <tr>
                            <th className="col-1">-</th>
                            <th className="col-2">Specialty Name</th>
                            <th className="col-3">Employees No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specialties.map((el, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{el.specialty_name}</td>
                                    <td>{el.count}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
