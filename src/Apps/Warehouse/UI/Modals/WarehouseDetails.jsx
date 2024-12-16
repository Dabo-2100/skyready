import React, { useContext } from 'react'
import NavTabs from '../Components/NavTabs'
import FullModal from './FullModal'
import ControlItems from '../Tabs/ControlItems'
import ControlWarehouse from '../Tabs/ControlWarehouse'
import ControlNotices from '../Tabs/ControlNotices'
import ControlLocations from '../Tabs/ControlLocations'
import Warehouse from '../../Core/Warehouse'
import { WarehouseContext } from '../../warehouseContext'

export default function WarehouseDetails() {
    const { activeWarehouse } = useContext(WarehouseContext);
    const warehouse = new Warehouse(activeWarehouse);
    return (
        <FullModal name={warehouse.name} >
            <FullModal.Content>
                <NavTabs>
                    <NavTabs.Tab style={{ height: "1rem" }} name="Warehouse Control"><ControlWarehouse /></NavTabs.Tab>
                    <NavTabs.Tab style={{ height: "1rem" }} name="Locations"><ControlLocations /></NavTabs.Tab>
                    <NavTabs.Tab style={{ height: "1rem" }} name="Notices Control"><ControlNotices /></NavTabs.Tab>
                    <NavTabs.Tab style={{ height: "1rem" }} name="Items Control"><ControlItems /></NavTabs.Tab>
                </NavTabs>
            </FullModal.Content>
        </FullModal>
    )
}
