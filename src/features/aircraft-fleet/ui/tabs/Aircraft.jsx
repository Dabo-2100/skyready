import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { $LoaderIndex, $UserInfo } from "../../../../store-recoil";
import NoData from "../../../../shared/ui/components/NoData";
import useAircraft from "../hooks/useAircraft";
import { User } from "../../../../shared/core/User";
import { useDispatch, useSelector } from "react-redux";
import { setActiveId } from "../../state/activeAircraftIdSlice";
import PrintBtn from "../../../../shared/ui/components/PrintBtn";
import { openModal } from "../../../../shared/state/modalSlice";

export default function Aircraft() {
    // const userData = { isAppAdmin: () => false };
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const aircraftFleetTable = useRef();
    const userData = new User(useRecoilValue($UserInfo));
    const [view, setView] = useState([]);
    const [aircraft, setAircaft] = useState([]);
    const [loaderIndex, setLoaderIndex] = useRecoilState($LoaderIndex);
    const dispatch = useDispatch();
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    const { getAircraftFleet, filterAircraftFleet } = useAircraft();

    useEffect(() => {
        setLoaderIndex(true);
        getAircraftFleet().then((res) => {
            setAircaft(res);
            setView(res);
            setTimeout(() => { setLoaderIndex(false) }, 500);
        });
    }, [refreshIndex]);

    return (
        < div className="col-12 d-flex flex-wrap p-3 Tab" id="aircraftTab" >
            <div className="col-12 d-flex flex-column content rounded-4 animate__animated animate__fadeIn">
                <div className="col-12 actions gap-3 gap-md-0 p-3 d-flex flex-wrap align-items-center justify-content-between">
                    <h5 className="m-0 text-white">Aircraft Fleet List</h5>
                    {
                        aircraft.length > 0 &&
                        <div className="col-12 col-md-5">
                            <input className="form-control" type="search" placeholder="Search Aircraft Fleet" onChange={(event) => filterAircraftFleet(aircraft, event.target.value).then(setView)} />
                        </div>
                    }
                    <div className="d-flex align-items-center gap-3">
                        <PrintBtn contentRef={aircraftFleetTable} />
                        {
                            userData.isAppAdmin(appIndex) &&
                            <button className="btn btn-danger addBtn" onClick={() => { dispatch(openModal(1001)) }}>
                                <FontAwesomeIcon icon={faAdd} /> Add Aircraft
                            </button>
                        }

                    </div>
                </div>
                {
                    !loaderIndex && (
                        aircraft.length == 0 ?
                            (
                                <NoData text="There are no aircraft into the fleet yet !" />
                            )
                            : (
                                <div className="col-12 p-3" style={{ height: "2vh", flexGrow: 1, overflow: "auto", borderTop: "1px solid #ffffff4d" }}>
                                    <table ref={aircraftFleetTable} className="col-12 table m-0 table-dark text-center">
                                        <thead>
                                            <tr className="animate__animated animate__fadeIn" >
                                                <th className="col-1">-</th>
                                                <th className="col-3">S/N</th>
                                                <th className="col-2">Registration Number</th>
                                                <th className="col-3">Model</th>
                                                <th className="col-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {view.map((el, index) => {
                                                return (
                                                    <tr key={index} className="animate__animated animate__fadeIn" onClick={() => { dispatch(setActiveId(el.aircraft_id)); dispatch(openModal(2000)) }}>
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

                            )
                    )
                }
            </div>
        </div >
    )
}
