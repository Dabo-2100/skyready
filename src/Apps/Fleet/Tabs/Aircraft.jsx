import { faAdd, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAircraftFleet } from "@/customHooks";
import { useContext, useEffect, useRef, useState } from "react";
import { FleetContext } from "../FleetContext";
import { useRecoilState } from "recoil";
import { $Server, $Token, $LoaderIndex, $UserInfo } from "@/store";
import NoData from "../Components/NoData";
import { HomeContext } from "@/Pages/HomePage/HomeContext";
export default function Aircraft() {
    const [aircraft, setAircaft] = useState([]);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [userInfo] = useRecoilState($UserInfo);
    const [loaderIndex, setLoaderIndex] = useRecoilState($LoaderIndex);
    const { openModal, refreshIndex } = useContext(HomeContext);
    const { setEditAircart_id } = useContext(FleetContext);
    const { appIndex } = useContext(HomeContext);
    const [roleName, setRoleName] = useState("");
    const [view, setView] = useState([]);

    const handleSearch = (event) => {
        let filter = aircraft.filter((el) => {
            if (
                el.aircraft_register_no.toLowerCase().includes(event.target.value.toLowerCase()) ||
                el.aircraft_serial_no.toLowerCase().includes(event.target.value.toLowerCase()) ||
                el.model_name.toLowerCase().includes(event.target.value.toLowerCase())
            ) {
                return el;
            };
        })
        setView(filter);
    }

    useEffect(() => {
        setRoleName(userInfo.user_roles.find(el => el['app_order'] == appIndex).role_name);
        setLoaderIndex(1)
        useAircraftFleet(serverUrl, token).then((res) => {
            setAircaft(res);
            setView(res);
            setLoaderIndex(0);
        })
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
                                        roleName != 'user' && (<button className="btn btn-danger addBtn" onClick={() => { openModal(1001) }}><FontAwesomeIcon icon={faAdd} /> Add Aircraft</button>)
                                    }
                                </div>
                            </div>
                            <NoData />
                        </>
                        )
                        : (
                            <div className="col-12 d-flex flex-column content rounded-4 animate__animated animate__fadeIn">
                                <div className="col-12 actions gap-3 gap-md-0 p-3 d-flex flex-wrap align-items-center justify-content-between">
                                    <h5 className="m-0 text-white">Aircraft Fleet List</h5>
                                    <div className="col-12 col-md-5">
                                        <input className="form-control" type="search" placeholder="Search Aircraft Fleet" onChange={handleSearch} />
                                    </div>
                                    {
                                        roleName != 'user' && (<button className="btn btn-danger addBtn" onClick={() => { openModal(1001) }}><FontAwesomeIcon icon={faAdd} /> Add Aircraft</button>)
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
                                                    <tr key={index} className="animate__animated animate__fadeIn" onClick={() => { openModal(2000); setEditAircart_id(el.aircraft_id) }}>
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
