import { useContext, useState } from "react";
import { FleetContext } from "../../FleetContext";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setAllZones } from "../../../../features/aircraft-fleet/state/selectedZonesSlice";

const ZoneNode = ({ node, action }) => {
    const hasChildren = node.children && node.children.length > 0;
    const dispatch = useDispatch();
    const selectedZones = useSelector(state => state.aircraftFleet.selectedZones.value);
    const { setZoneParent, setRemoveZone_id } = useContext(FleetContext);
    const [expanded, setExpanded] = useState(false);

    const toggleZone = () => {
        let zone_obj = { zone_id: node.zone_id, zone_name: node.zone_name }
        let isHere = selectedZones.findIndex(el => el.zone_id == node.zone_id);
        let Orignal = [...selectedZones];
        isHere == -1 ? Orignal.push(zone_obj) : Orignal.splice(isHere, 1);
        dispatch(setAllZones(Orignal));
    }

    return (
        <div style={{ marginLeft: '0px' }}>
            <div
                className={`ZoneRoot p-0 col-12 d-flex ${(hasChildren || !node.parent_id) ? 'mb-2' : 'mb-1'}`}
                onClick={() => { setExpanded(!expanded) }}
                style={{ cursor: 'pointer' }}>
                <div style={{ cursor: 'pointer' }} className="d-flex col-12 p-3 align-items-center justify-content-between" >
                    <div className="d-flex gap-2 align-items-center">
                        {hasChildren && (<span>{expanded ? '▼' : '▶'}</span>)}
                        {node.zone_name}
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {
                            action == "edit" ?
                                (
                                    <>
                                        {
                                            !hasChildren && (
                                                <button className="btn btn-danger" onClick={() => setRemoveZone_id(node.zone_id)}>Remove Zone</button>
                                            )
                                        }
                                        <button className="btn addBtn"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                setZoneParent({ id: node.zone_id, name: node.zone_name })
                                            }}>Add Sub Zone</button>
                                    </>
                                )
                                : ((
                                    <div className="cntr">
                                        <input
                                            onClick={(event) => event.stopPropagation()}
                                            defaultChecked={
                                                selectedZones.findIndex((el) => {
                                                    return el.zone_id == node.zone_id;
                                                }) == -1 ? false : true
                                            }
                                            onChange={toggleZone}
                                            id={`zone_${node.zone_id}`} type="checkbox" className="hidden-xs-up input" />
                                        <label onClick={(event) => event.stopPropagation()} htmlFor={`zone_${node.zone_id}`} className="cbx"></label>
                                    </div>
                                ))
                        }
                    </div>
                </div>
            </div>
            {
                expanded && hasChildren && (
                    <div className="p-2">
                        {
                            node.children.map((childNode) => {
                                return <ZoneNode key={childNode.zone_id} node={childNode} action={action} />
                            })
                        }
                    </div>
                )
            }
        </div >
    );
};

export default ZoneNode;

ZoneNode.propTypes = {
    action: PropTypes.string,
    node: PropTypes.node,
};