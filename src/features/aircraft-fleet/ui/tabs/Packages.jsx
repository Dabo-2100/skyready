import { useContext, useEffect } from "react";
import usePackagesData from "../hooks/usePackagesData";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import TreeView from "../../../../Apps/Fleet/Components/Tree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import NoData from "../../../../Apps/Fleet/Components/NoData";
import ControlsBtn from "../../../../Apps/Warehouse/UI/Components/ControlsBtn";
import { useDispatch, useSelector } from "react-redux";
import { setActiveType } from "../../state/activeWorkPackageTypeIdSlice";
import { setActiveId } from "../../state/activeWorkPackageFolderIdSlice";
import { setActiveId as resetActiveId } from "../../state/activeWorkPackageIdSlice";

export default function Packages() {
    const { refreshIndex } = useContext(HomeContext);
    const dispatch = useDispatch();
    const activeWorkPackageTypeId = useSelector(state => state.aircraftFleet.activeWorkPackageTypeId.value);
    const { workPackageTypes, workPackages } = usePackagesData();
    const { openModal } = useContext(HomeContext);

    useEffect(() => {
        let wp_Type_Index = workPackageTypes.findIndex(el => el.package_type_id == activeWorkPackageTypeId);
        if (wp_Type_Index == -1 && workPackageTypes.length > 0) {
            dispatch(setActiveType(workPackageTypes[0].package_type_id))
        }
    }, [workPackageTypes, refreshIndex]);

    return (
        <div className="col-12 d-flex flex-wrap p-3 Tab" id="packagesTab">
            <div className="col-12 content rounded-4 d-flex flex-column">
                <div style={{ borderBottom: "1px solid #ffffff4d" }} className="col-12 pe-3 actions d-flex align-items-center justify-content-between">
                    <div className="d-flex row-gap-2 flex-wrap justify-content-start">
                        {
                            workPackageTypes.map((el, index) => {
                                return (
                                    <span
                                        key={index}
                                        onClick={() => { dispatch(setActiveType(el.package_type_id)) }}
                                        className={`text-center tab p-3 ${el.package_type_id == activeWorkPackageTypeId ? 'package-active' : 'package-inactvie'}`}>
                                        {el.package_type_name}
                                    </span>
                                )
                            })
                        }
                    </div>
                    <ControlsBtn onClick={() => openModal(3000)} />
                </div>
                {
                    activeWorkPackageTypeId != 0 && (
                        <div className="col-12 d-flex flex-column" style={{ height: "1vh", flexGrow: 1 }}>
                            <header className="col-12 d-flex align-items-center justify-content-end " >
                                <button
                                    style={{ fontSize: "12px", borderRadius: "0" }}
                                    className="btn btn-danger d-flex align-items-center gap-2 addBtn"
                                    onClick={() => { dispatch(setActiveId(0)); dispatch(resetActiveId(0)); openModal(4000) }}>
                                    <FontAwesomeIcon icon={faAdd} />
                                    New {workPackageTypes.length > 0 &&
                                        workPackageTypes.find(el => el.package_type_id == activeWorkPackageTypeId)['package_type_name']
                                    }
                                </button>
                            </header>
                            <div className="col-12 p-3" style={{ flexGrow: 1, height: "1vh", overflow: "auto", borderTop: "1px solid #ffffff4d", }}>
                                {workPackages.length > 0 ? <TreeView data={workPackages} /> : <NoData />}
                            </div>
                        </div>
                    )
                }

            </div>
        </div>
    )
}
