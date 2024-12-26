import { faAdd, faFilter, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { FleetContext } from "../FleetContext";
import { useRecoilState } from "recoil";
import { $Server, $Token } from "@/store";
import { useWorkPackageTypes, useWorkPackages, buildTree } from "@/customHooks";
import TreeView from "../Components/Tree";
import NoData from "../Components/NoData";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function Packages() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [packageTypes, setPackageTypes] = useState([{ package_type_name: null }]);
    const [packages, setPackages] = useState([]);
    const [activeType, setActiveType] = useState(0);
    const { openModal, refreshIndex, } = useContext(HomeContext);
    const { activePackageType, setActivePackageType, setParent_id } = useContext(FleetContext);

    const openType = (id) => {
        useWorkPackages(serverUrl, token, id).then((res) => {
            setPackages(buildTree(res).sort((a, b) => a.package_name.localeCompare(b.package_name)));
        });
    }

    useEffect(() => {
        useWorkPackageTypes(serverUrl, token).then((res) => { setPackageTypes(res) });
        useWorkPackages(serverUrl, token, activePackageType).then((res) => { setPackages(buildTree(res).sort((a, b) => a.package_name.localeCompare(b.package_name))) });
    }, [refreshIndex]);

    return (
        <div className="col-12 d-flex flex-wrap p-3 Tab" id="packagesTab">
            <div className="col-12 content rounded-4 d-flex flex-column">
                <div style={{ borderBottom: "1px solid #ffffff4d" }} className="col-12 actions d-flex align-items-center justify-content-between">
                    <div className="d-flex row-gap-2 flex-wrap justify-content-start">
                        {
                            packageTypes.map((el, index) => {
                                return (
                                    <span
                                        key={index}
                                        onClick={() => {
                                            openType(el.package_type_id);
                                            setActivePackageType(el.package_type_id)
                                            setActiveType(packageTypes.findIndex((element) => { return element.package_type_id == el.package_type_id }))
                                        }}
                                        className={`text-center tab p-3 ${el.package_type_id == activePackageType ? 'package-active' : 'package-inactvie'}`}>
                                        {el.package_type_name}
                                    </span>
                                )
                            })
                        }
                    </div>

                    <div className="d-flex align-items-center">
                        <button title="Controls" className="settingsButton" onClick={() => openModal(3000)}>
                            <svg viewBox="0 0 512 512" height="1em">
                                <path
                                    d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                {
                    activePackageType != 0 && (
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
                                    New {packageTypes[activeType]['package_type_name']}
                                </button>
                            </header>
                            <div className="col-12 p-3" style={{ flexGrow: 1, height: "1vh", overflow: "auto", borderTop: "1px solid #ffffff4d", }}>
                                {
                                    packages.length > 0 ? <TreeView data={packages} /> : <NoData />
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}
