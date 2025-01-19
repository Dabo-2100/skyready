// ThemeContext.js
import { createContext, useState } from "react";

const FleetContext = createContext();

const FleetProvider = ({ children }) => {
    const [zoneParent, setZoneParent] = useState({ id: 0, name: "" });
    const [removeZone_id, setRemoveZone_id,] = useState(0);
    const [specialty_id, setSpecialty_id] = useState(0);
    const [openPackage_id, setOpenPackage_id] = useState(0);
    const [taskToEdit, setTaskToEdit] = useState(0);
    return (
        <FleetContext.Provider value={{
            zoneParent, setZoneParent,
            removeZone_id, setRemoveZone_id,
            openPackage_id, setOpenPackage_id,
            specialty_id, setSpecialty_id,
            taskToEdit, setTaskToEdit,
        }}>
            {children}
        </FleetContext.Provider>
    );
};

export { FleetContext, FleetProvider };
