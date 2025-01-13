import { useEffect, useRef, useState } from "react"

import useAircraft from "../hooks/useAircraft";
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import ControlsBtn from "../../../../Apps/Warehouse/UI/Components/ControlsBtn";
import { useDispatch, useSelector } from "react-redux";
import { setAircraftZones } from "../../state/aircraftZonesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import TreeView from "../../../../Apps/Fleet/Components/Tree";
import { buildTree } from "../../../../shared/utilities/buildTree";

export default function NewAircraftZone() {
    const dispatch = useDispatch();
    const aircraftZones = useSelector(state => state.aircraftFleet.aircraftZones.value);
    const { getAircraftZones } = useAircraft();
    const [zoneParent, setZoneParent] = useState({ id: 0, name: "Test" })

    const [isEdit, setIsEdit] = useState(false);
    // ====> Refs
    const new_zone_name = useRef();
    // const handleSubmit = () => { }

    // const handleSubmit = () => {
    //     event.preventDefault();
    //     let obj = {
    //         model_id: packageInfo.model_id,
    //         zone_name: new_zone_name.current.value
    //     }
    //     if (zoneParent.id != 0) { obj.parent_id = zoneParent.id }
    //     if (new_zone_name.current.value) {
    //         axios.post(`${serverUrl}/php/index.php/api/aircraft/zones/store`, obj,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         ).then((res) => {
    //             if (!res.data.err) {
    //                 Swal.fire({
    //                     icon: "success",
    //                     text: "New zone Added Success !",
    //                     customClass: darkSwal,
    //                     timer: 1500,
    //                     showConfirmButton: false,
    //                 }).then(() => {
    //                     setZoneParent({ id: 0, name: "" });
    //                     setZones(buildTree(res.data.data, "zone_id"));
    //                 })
    //             }
    //             else {
    //                 Swal.fire({
    //                     icon: "error",
    //                     text: res.data.msg.errorInfo[2],
    //                     customClass: darkSwal,
    //                     // timer: 1500,
    //                     // showConfirmButton: false,
    //                 })
    //             }
    //         }).catch((err) => {
    //             console.log(err);
    //         })
    //     }
    //     else {
    //         Swal.fire({
    //             icon: "error",
    //             text: "Please Enter Zone Name",
    //             timer: 1500,
    //         })
    //     }
    //     new_zone_name.current.value = "";
    // }

    useEffect(() => {
        if (aircraftZones.length == 0) {
            getAircraftZones(1).then((res) => {
                dispatch(setAircraftZones(buildTree(res, "zone_id")));
            })
        }
    }, [aircraftZones]);

    const handleSubmit = () => { }
    // ====> Watchers
    // useEffect(() => {
    //     if (removeZone_id != 0) {
    //         Swal.fire({
    //             icon: "question",
    //             text: "Are You Sure You Want to Delete ?",
    //             customClass: darkSwal,
    //             showDenyButton: true,
    //         }).then((res) => {
    //             if (res.isConfirmed) {
    //                 let obj = {
    //                     zone_id: removeZone_id,
    //                 }
    //                 new_zone_name.current.value = "";
    //                 axios.post(`${serverUrl}/php/index.php/api/aircraft/zones/delete`, obj,
    //                     {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`,
    //                         },
    //                     }
    //                 ).then((res) => {
    //                     if (!res.data.err) {
    //                         Swal.fire({
    //                             icon: "success",
    //                             text: "zone Deleted Success !",
    //                             customClass: darkSwal,
    //                             timer: 1500,
    //                             showConfirmButton: false,
    //                         }).then(() => {
    //                             setZoneParent({ id: 0, name: "" });
    //                             setZones(buildTree(res.data.data, "zone_id"));
    //                         })
    //                     }
    //                     else {
    //                         Swal.fire({
    //                             icon: "error",
    //                             text: res.data.msg.errorInfo[2],
    //                             customClass: darkSwal,
    //                         })
    //                     }
    //                 }).catch((err) => {
    //                     console.log(err);
    //                 })
    //             }
    //             setRemoveZone_id(0);
    //         })
    //     }
    // }, [removeZone_id])
    // ====> JSX
    return (
        <Modal>
            <header className="col-12 d-flex p-0 px-3 pb-2 align-content-center justify-content-between">
                <div className="d-flex align-items-center gap-3 justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="mb-0 fw-bold">{isEdit ? "Edit" : "Select"} Working Zones</h5>
                    </div>
                </div>
                <ControlsBtn onClick={() => setIsEdit(!isEdit)} />
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
                    <TreeView data={aircraftZones} type="zone" action={isEdit ? 'edit' : null} />
                </footer>)
            }
        </Modal>

    )
}