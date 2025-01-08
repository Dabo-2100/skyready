import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
// import { AircraftFleetContext } from "../../AircraftFleetContext";
import { useRecoilState, useRecoilValue } from "recoil";
import { $LoaderIndex, $UserInfo } from "../../../../store";
import NoData from "../../../../shared/ui/components/NoData";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import useAircraft from "../hooks/useAircraft";
import { User } from "../../../../shared/core/User";
import { useDispatch } from "react-redux";
import { setActiveId } from "../../state/activeAircraftIdSlice";
export default function Aircraft() {
    const [view, setView] = useState([]);
    const [aircraft, setAircaft] = useState([]);
    const [loaderIndex, setLoaderIndex] = useRecoilState($LoaderIndex);
    const userData = new User(useRecoilValue($UserInfo));

    const { openModal, refreshIndex } = useContext(HomeContext);
    const dispatch = useDispatch();

    // const { setEditAircart_id } = useContext(AircraftFleetContext);
    const { appIndex } = useContext(HomeContext);

    const { getAircraftFleet, filterAircraftFleet } = useAircraft();

    useEffect(() => {
        getAircraftFleet().then((res) => { setAircaft(res); setView(res); setLoaderIndex(false) });
    }, [refreshIndex]);

    return (
        < div className="col-12 d-flex flex-wrap p-3 Tab" id="aircraftTab" >
            {
                !loaderIndex && (
                    aircraft.length == 0 ?
                        (<>
                            <div className="col-12 actions pb-3 d-flex align-items-center justify-content-between">
                                <h5 className="m-0 text-white">Aircraft Fleet List</h5>
                                <div className="d-flex align-items-center gap-3">
                                    {
                                        userData.isAppAdmin(appIndex) &&
                                        <button className="btn btn-danger addBtn" onClick={() => { openModal(1001) }}>
                                            <FontAwesomeIcon icon={faAdd} /> Add Aircraft
                                        </button>
                                    }
                                </div>
                            </div>
                            <NoData text="There are no aircraft added to fleet yet !" />
                        </>
                        )
                        : (
                            <div className="col-12 d-flex flex-column content rounded-4 animate__animated animate__fadeIn">
                                <div className="col-12 actions gap-3 gap-md-0 p-3 d-flex flex-wrap align-items-center justify-content-between">
                                    <h5 className="m-0 text-white">Aircraft Fleet List</h5>
                                    <div className="col-12 col-md-5">
                                        <input className="form-control" type="search" placeholder="Search Aircraft Fleet" onChange={(event) => filterAircraftFleet(aircraft, event.target.value).then(setView)} />
                                    </div>
                                    {
                                        userData.isAppAdmin(appIndex) &&
                                        <button className="btn btn-danger addBtn" onClick={() => { openModal(1001) }}>
                                            <FontAwesomeIcon icon={faAdd} /> Add Aircraft
                                        </button>
                                    }
                                </div>
                                <div className="col-12 p-3" style={{ height: "2vh", flexGrow: 1, overflow: "auto", borderTop: "1px solid #ffffff4d" }}>
                                    <table className="col-12 table m-0 table-dark text-center">
                                        <thead>
                                            <tr className="animate__animated animate__fadeIn" >
                                                <th className="col-1">-</th>
                                                <th className="col-3">S/N</th>
                                                <th className="col-2">Registration Number</th>
                                                <th className="col-3 ">Model</th>
                                                <th className="col-3">Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {view.map((el, index) => {
                                                return (
                                                    <tr key={index} className="animate__animated animate__fadeIn" onClick={() => { dispatch(setActiveId(el.aircraft_id)); openModal(2000) }}>
                                                        <td>{index + 1}</td>
                                                        <td>{el.aircraft_serial_no}</td>
                                                        <td>{el.aircraft_register_no}</td>
                                                        <td>{el.model_name}</td>
                                                        <td>{el.status_name}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                )
            }
        </div >
    )
}
