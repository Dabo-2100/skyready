// import { faAdd } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import TreeView from "../Components/Tree";
// import NoData from "../Components/NoData";
// import { HomeContext } from "";
import { useContext, useEffect, useState } from "react";
import usePackagesData from "../hooks/usePackagesData";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import TreeView from "../../../../Apps/Fleet/Components/Tree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { AircraftFleetContext } from "../../AircraftFleetContext";
import NoData from "../../../../Apps/Fleet/Components/NoData";

export default function Packages() {
    const { activeWorkPackaeTypeId, setActiveWorkPackaeTypeId } = useContext(AircraftFleetContext);
    const { workPackageTypes, workPackages } = usePackagesData();

    useEffect(() => {
    }, []);


    const { openModal } = useContext(HomeContext);
    const openType = (id) => {

    }
    // const { activeWorkPackaeTypeId, setActiveWorkPackaeTypeId, setParent_id } = useContext(FleetContext);

    // const openType = (id) => {
    //     useWorkPackages(serverUrl, token, id).then((res) => {
    //         setPackages(buildTree(res).sort((a, b) => a.package_name.localeCompare(b.package_name)));
    //     });
    // }

    // useEffect(() => {
    //     useWorkPackageTypes(serverUrl, token).then((res) => { setPackageTypes(res) });
    //     useWorkPackages(serverUrl, token, activeWorkPackaeTypeId).then((res) => { setPackages(buildTree(res).sort((a, b) => a.package_name.localeCompare(b.package_name))) });
    // }, [refreshIndex]);

    return (
        <div className="col-12 d-flex flex-wrap p-3 Tab" id="packagesTab">
            <div className="col-12 content rounded-4 d-flex flex-column">
                <div style={{ borderBottom: "1px solid #ffffff4d" }} className="col-12 actions d-flex align-items-center justify-content-between">
                    <div className="d-flex row-gap-2 flex-wrap justify-content-start">
                        {
                            workPackageTypes.map((el, index) => {
                                return (
                                    <span
                                        key={index}
                                        onClick={() => { setActiveWorkPackaeTypeId(el.package_type_id) }}
                                        className={`text-center tab p-3 ${el.package_type_id == activeWorkPackaeTypeId ? 'package-active' : 'package-inactvie'}`}>
                                        {el.package_type_name}
                                    </span>
                                )
                            })
                        }
                    </div>

                    <div className="d-flex align-items-center">
                        <button title="Controls" className="settingsButton" onClick={
                            () => openModal(3000)
                        }>
                            <svg viewBox="0 0 512 512" height="1em">
                                <path
                                    d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                {
                    activeWorkPackaeTypeId != 0 && (
                        <div className="col-12 d-flex flex-column" style={{ height: "1vh", flexGrow: 1 }}>
                            <header className="col-12 d-flex align-items-center justify-content-end " >
                                <button
                                    style={{ fontSize: "12px", borderRadius: "0" }}
                                    className="btn btn-danger d-flex align-items-center gap-2 addBtn"
                                    onClick={() => {
                                        setParent_id(null);
                                        openModal(4000);
                                    }}>
                                    <FontAwesomeIcon icon={faAdd} />
                                    New {workPackageTypes[activeWorkPackaeTypeId] && workPackageTypes[activeWorkPackaeTypeId]['package_type_name']}
                                </button>
                            </header>
                            <div className="col-12 p-3" style={{ flexGrow: 1, height: "1vh", overflow: "auto", borderTop: "1px solid #ffffff4d", }}>
                                {
                                    workPackages.length > 0 ? <TreeView data={workPackages} /> : <NoData />
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}
