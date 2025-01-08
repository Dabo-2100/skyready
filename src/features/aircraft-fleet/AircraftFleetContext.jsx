import PropTypes from "prop-types";
import { createContext, useState } from "react";

const AircraftFleetContext = createContext();
const AircraftFleetProvider = ({ children }) => {

    // Tab Index State
    // const [tabIndex, setTabIndex] = useState(0);
    // const [editAircaft_id, setEditAircart_id] = useState(0);
    const [activeWorkPackaeTypeId, setActiveWorkPackaeTypeId] = useState(0);
    const [editPackage_id, setEditPackage_id] = useState(0);
    const [parent_id, setParent_id] = useState(0);
    // Aircraft to Edit id State
    const [zoneParent, setZoneParent] = useState({ id: 0, name: "" });
    const [removeZone_id, setRemoveZone_id] = useState(0);
    const [specialty_id, setSpecialty_id] = useState(0);
    const [openPackage_id, setOpenPackage_id] = useState(0);
    const [selectedZones, setSelectedZones] = useState([]);
    const removeSelectedZone = (zone_id) => {
        let oZones = [...selectedZones];
        let zoneIndex = oZones.findIndex(el => el.zone_id == zone_id);
        oZones.splice(zoneIndex, 1);
        setSelectedZones(oZones);
    }
    const [selectedDesignators, setSelectedDesignators] = useState([]);
    const removeSelectedDesignator = (designtor_id) => {
        let orignal = [...selectedDesignators];
        let Index = orignal.findIndex(el => el.designator_id == designtor_id);
        orignal.splice(Index, 1);
        setSelectedDesignators(orignal);
    }
    const [taskToEdit, setTaskToEdit] = useState(0);
    return (
        <AircraftFleetContext.Provider value={{
            editPackage_id, setEditPackage_id,
            parent_id, setParent_id,
            zoneParent, setZoneParent,
            removeZone_id, setRemoveZone_id,
            specialty_id, setSpecialty_id,
            openPackage_id, setOpenPackage_id,
            selectedZones, setSelectedZones,
            removeSelectedZone, selectedDesignators, setSelectedDesignators,
            removeSelectedDesignator, taskToEdit, setTaskToEdit, activeWorkPackaeTypeId, setActiveWorkPackaeTypeId,
        }}>
            {children}
        </AircraftFleetContext.Provider>
    );
};

AircraftFleetProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AircraftFleetContext, AircraftFleetProvider };
