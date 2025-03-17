import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import NoData from "../../../../shared/ui/components/NoData";
import { useDispatch, useSelector } from "react-redux";
import { setActiveType } from "../../state/activeWorkPackageTypeIdSlice";
import { setActiveId } from "../../state/activeWorkPackageFolderIdSlice";
import { setActiveId as resetActiveId } from "../../state/activeWorkPackageIdSlice";
import usePackages from "../hooks/usePackages";
import { setWorkPackages } from "../../state/workPackagesSlice";
import { setWorkPackageTypes } from "../../state/workPackageTypesSlice";
import { buildTree } from "../../../../shared/utilities/buildTree";
import { useRecoilState } from "recoil";
import { $LoaderIndex } from "../../../../store-recoil";
import { openModal } from "../../../../shared/state/modalSlice";
import TreeView from "../../../../shared/ui/components/Tree";
import ControlsBtn from "../../../../shared/ui/components/ControlsBtn";

export default function Packages() {
    const [loaderIndex, setLoaderIndex] = useRecoilState($LoaderIndex);
    const dispatch = useDispatch();
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const workPackages = useSelector(state => state.aircraftFleet.workPackages.value);
    const workPackageTypes = useSelector(state => state.aircraftFleet.workPackageTypes.value);
    const activeWorkPackageTypeId = useSelector(state => state.aircraftFleet.activeWorkPackageTypeId.value);
    const { getWorkPackages, getWorkPackageTypes } = usePackages();
    useEffect(() => {
        setLoaderIndex(true)
        let active = activeWorkPackageTypeId;
        getWorkPackageTypes().then(res => {
            dispatch(setWorkPackageTypes(res));
            if (activeWorkPackageTypeId == 0) { active = res[0].package_type_id }
            dispatch(setActiveType(active))
        }).then(() => {
            getWorkPackages(active).then(res => {
                dispatch(setWorkPackages([...res]));
                setLoaderIndex(false)
            });
        })

        // eslint-disable-next-line
    }, [activeWorkPackageTypeId, refreshIndex]);


    useEffect(() => {

    }, [refreshIndex]);

    return (
        <div className="col-12 d-flex flex-wrap p-3 Tab" id="packagesTab">
            {

                <div className="col-12 content rounded-4 d-flex flex-column animate__animated animate__fadeIn">
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
                        <ControlsBtn onClick={() => dispatch(openModal(3000))} />
                    </div>
                    {
                        activeWorkPackageTypeId != 0 && !loaderIndex && (
                            <div className="col-12 d-flex flex-column" style={{ height: "1vh", flexGrow: 1 }}>
                                <header className="col-12 d-flex align-items-center justify-content-end " >
                                    <button
                                        style={{ fontSize: "12px", borderRadius: "0" }}
                                        className="btn btn-danger d-flex align-items-center gap-2 addBtn"
                                        onClick={() => { dispatch(setActiveId(0)); dispatch(resetActiveId(0)); dispatch(openModal(4000)) }}>
                                        <FontAwesomeIcon icon={faAdd} />
                                        New {workPackageTypes.length > 0 &&
                                            workPackageTypes.find(el => el.package_type_id == activeWorkPackageTypeId)['package_type_name']
                                        }
                                    </button>
                                </header>
                                <div className="col-12 p-3" style={{ flexGrow: 1, height: "1vh", overflow: "auto", borderTop: "1px solid #ffffff4d", }}>
                                    {workPackages.length > 0 ? <TreeView data={buildTree(workPackages).sort((a, b) => a.package_name.localeCompare(b.package_name))} /> : <NoData />}
                                </div>
                            </div>
                        )
                    }
                </div>
            }
        </div>
    )
}
