import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import useAircraft from "../hooks/useAircraft";
import ControlsBtn from "../../../../shared/ui/components/ControlsBtn";
import { setAircraftZones } from "../../state/aircraftZonesSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { buildTree } from "../../../../shared/utilities/buildTree";
import { resetActiveId } from "../../state/activeParentZoneSlice";
import Modal from "../../../../shared/ui/modals/Modal";
import TreeView from "../../../../shared/ui/components/Tree";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";

export default function NewAircraftZone() {
    const dispatch = useDispatch();
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const aircraftZones = useSelector(state => state.aircraftFleet.aircraftZones.value);
    const zoneParent = useSelector(state => state.aircraftFleet.activeParentZone.value);
    const activeWorkPackageInfo = useSelector(state => state.aircraftFleet.activeWorkPackageInfo.value);
    const { getAircraftZones, addNewAircraftZone } = useAircraft();
    const [isEdit, setIsEdit] = useState(false);
    const new_zone_name = useRef();
    const handleSubmit = () => { addNewAircraftZone(new_zone_name).then(() => { new_zone_name.current.value = "" }) }
    useEffect(() => {
        getAircraftZones(activeWorkPackageInfo.model_id).then((res) => {
            dispatch(setAircraftZones(buildTree(res, "zone_id")));
        })
        // eslint-disable-next-line
    }, [aircraftZones, refreshIndex]);

    useEffect(() => { return () => { dispatch(resetActiveId()) } }, [])

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
                        <div className="col-12 d-flex flex-wrap gap-3" >
                            <div className="col-12 inputField">
                                <label className="col-12 col-12 d-flex align-items-center gap-3" htmlFor="mn">
                                    Add New {zoneParent.id == 0 ? "Parent Zone" : "Sub Zone To :"}
                                    {zoneParent.id != 0 &&
                                        (<button type="button" className="btn addBtn d-flex d-flex gap-3 align-items-center">
                                            {zoneParent.name}
                                            <FontAwesomeIcon icon={faX} className="closeModalIcon p-2 rounded-5" style={{ backgroundColor: "red" }} onClick={() => { dispatch(resetActiveId()) }} />
                                        </button>)
                                    }
                                </label>
                                <div className="col-12 d-flex gap-4">
                                    <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_zone_name} placeholder="Enter zone name" />
                                    <SaveBtn label="Save" onClick={handleSubmit} />
                                </div>
                            </div>
                        </div>
                    </main>
                )
            }
            {
                zoneParent.id == 0 &&
                <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                    <TreeView data={aircraftZones} type="zone" action={isEdit ? 'edit' : null} />
                </footer>
            }
        </Modal>
    )
}