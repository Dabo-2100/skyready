import PropTypes from "prop-types";
import { createContext, useState } from "react";
const WarehouseContext = createContext();
const WarehouseProvider = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [activeWarehouse, setActiveWarehouse] = useState(0);
    return (
        <WarehouseContext.Provider value={{ activeTab, setActiveTab, activeWarehouse, setActiveWarehouse }}>
            {children}
        </WarehouseContext.Provider>
    )
}

WarehouseProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { WarehouseContext, WarehouseProvider }