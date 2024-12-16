import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAircraftZones, buildTree } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import TreeView from "../Components/Tree";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function NewAircraftZone() {
    // ====> Recoil States
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    // ====> Context States 
    const { closeModal } = useContext(HomeContext);
    const { openPackage_id, zoneParent, setZoneParent, removeZone_id, setRemoveZone_id } = useContext(FleetContext);
    // ====> Component States 
    const [packageInfo, setPackageInfo] = useState();
    const [zones, setZones] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    // ====> Refs
    const new_zone_name = useRef();
    // ====> Functions
    const getPackageData = async () => {
        let final = {};
        await axios.get(`${serverUrl}/php/index.php/api/packages/${openPackage_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            final = res.data.data.info;
        }).catch(err => console.log(err))
        return final;
    }
    const handleSubmit = () => {
        event.preventDefault();
        let obj = {
            model_id: packageInfo.model_id,
            zone_name: new_zone_name.current.value
        }
        if (zoneParent.id != 0) { obj.parent_id = zoneParent.id }
        if (new_zone_name.current.value) {
            axios.post(`${serverUrl}/php/index.php/api/aircraft/zones/store`, obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((res) => {
                if (!res.data.err) {
                    Swal.fire({
                        icon: "success",
                        text: "New zone Added Success !",
                        customClass: darkSwal,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        setZoneParent({ id: 0, name: "" });
                        setZones(buildTree(res.data.data, "zone_id"));
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
                text: "Please Enter Zone Name",
                timer: 1500,
            })
        }
        new_zone_name.current.value = "";
    }
    // ====> Side Effects
    useEffect(() => {
        getPackageData().then((res) => {
            setPackageInfo(res);
            useAircraftZones(serverUrl, token, res.model_id).then((res) => {
                setZones(buildTree(res, "zone_id"));
            });
        });
    }, [])
    // ====> Watchers
    useEffect(() => {
        if (removeZone_id != 0) {
            Swal.fire({
                icon: "question",
                text: "Are You Sure You Want to Delete ?",
                customClass: darkSwal,
                showDenyButton: true,
            }).then((res) => {
                if (res.isConfirmed) {
                    let obj = {
                        zone_id: removeZone_id,
                    }
                    new_zone_name.current.value = "";
                    axios.post(`${serverUrl}/php/index.php/api/aircraft/zones/delete`, obj,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    ).then((res) => {
                        if (!res.data.err) {
                            Swal.fire({
                                icon: "success",
                                text: "zone Deleted Success !",
                                customClass: darkSwal,
                                timer: 1500,
                                showConfirmButton: false,
                            }).then(() => {
                                setZoneParent({ id: 0, name: "" });
                                setZones(buildTree(res.data.data, "zone_id"));
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
                setRemoveZone_id(0);
            })
        }
    }, [removeZone_id])
    // ====> JSX
    return (
        <div className="modal">
            <div className="content animate__animated animate__fadeIn" onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button type="button" className="backButton" onClick={() => { setZoneParent({ id: 0, name: "" }); closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <header className="col-12 d-flex p-0 px-3 pb-2 align-content-center justify-content-between">
                    <div className="d-flex align-items-center gap-3 justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                            <h5 className="mb-0 fw-bold">{isEdit ? "Edit" : "Select"} Working Zones</h5>
                        </div>
                    </div>
                    <button title="Controls" className="settingsButton" onClick={() => setIsEdit(!isEdit)}>
                        <svg viewBox="0 0 512 512" height="1em">
                            <path
                                d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                            ></path>
                        </svg>
                    </button>
                    {/* <FontAwesomeIcon icon={faX} className="closeModalIcon" onClick={() => { setZoneParent({ id: 0, name: "" }); closeModal() }} /> */}
                </header>
                {
                    (isEdit) && (
                        <main className="col-12 d-flex flex-wrap">
                            <form className="col-12 d-flex flex-wrap gap-3" onSubmit={handleSubmit}>
                                <div className="col-12 inputField">
                                    <label className="col-12 col-12 d-flex align-items-center gap-3" htmlFor="mn">
                                        Add New {zoneParent.id == 0 ? "Parent Zone" : "Sub Zone To :"}
                                        {zoneParent.id != 0 &&
                                            (<button type="button" className="btn addBtn d-flex d-flex gap-3 align-items-center">
                                                {zoneParent.name}
                                                <FontAwesomeIcon icon={faX} className="closeModalIcon p-2 rounded-5" style={{ backgroundColor: "red" }} onClick={() => { setZoneParent({ id: 0, name: "" }) }} />
                                            </button>)
                                        }
                                    </label>
                                    <div className="col-12 d-flex gap-4">
                                        <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_zone_name} placeholder="Enter zone name" />
                                        <button className="saveButton">
                                            <div className="svg-wrapper-1"><div className="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path></svg></div></div>
                                            <span>Save</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </main>
                    )
                }
                {
                    zoneParent.id == 0 &&
                    (<footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                        <TreeView data={zones} type="zone" action={isEdit ? 'edit' : null} />
                    </footer>)
                }
            </div>
        </div>
    )
}