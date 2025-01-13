import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { removeZoneByZoneId } from "../../state/selectedZonesSlice";
import { useContext } from "react";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";

export default function TaskWorkingZone() {
    const dispatch = useDispatch();
    const { openModal4 } = useContext(HomeContext);
    const selectedZones = useSelector(state => state.aircraftFleet.selectedZones.value);
    return (
        <div className="col-12 d-flex flex-wrap">
            <div className="col-12 d-flex align-items-center justify-content-between">
                <label>Working Zones</label>
                <button className="addMoreButton" type="button" onClick={() => openModal4(1006)}>
                    <div className="sign">+</div>
                    <div className="text">Add Zone</div>
                </button>
            </div>
            <div className="col-12 d-flex gap-2 flex-wrap">
                {
                    (selectedZones.length > 0) && (selectedZones.map((zone) => {
                        return (
                            <button type="button" className="btn d-flex align-items-center gap-2 addBtn" key={zone.zone_id} >
                                <p>{zone.zone_name}</p>
                                <FontAwesomeIcon onClick={() => { dispatch(removeZoneByZoneId(zone.zone_id)) }} icon={faX} />
                            </button>
                        )
                    })
                    )
                }
            </div>
        </div>
    )
}
