import "./index.css";
import Aircraft from "../ui/tabs/Aircraft";
import Packages from "../ui/tabs/Packages";
import NavTabs from "../../../shared/ui/components/NavTabs";
import ConnectorFinder from "../ui/tabs/ConnectorFinder";
import { useEffect } from "react";
import useAircraft from "../ui/hooks/useAircraft";

import { useDispatch, useSelector } from "react-redux";
import { setAircraftManufacturers } from "../state/aircraftManufacturersSlice";
import { setAircraftStatus } from "../state/aircraftStatusSlice";
import { setAircraftModels } from "../state/aircraftModelsSlice";
import { setAircraftUsages } from "../state/aircraftUsagesSlice";

export default function FleetApp() {
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const { getAircraftManufacturers, getAircraftStatus, getAircraftModels, getAircraftUsages } = useAircraft();
    const dispatch = useDispatch();
    useEffect(() => {
        getAircraftManufacturers().then(res => dispatch(setAircraftManufacturers(res)));
        getAircraftStatus().then(res => dispatch(setAircraftStatus(res)));
        getAircraftModels().then(res => dispatch(setAircraftModels(res)));
        getAircraftUsages().then(res => dispatch(setAircraftUsages(res)));
    }, [refreshIndex])
    return (
        <div className="col-12 d-flex flex-column" id="FleetApp" >
            <NavTabs style={{ height: "100vh" }}>
                <NavTabs.Tab name="Aircraft Fleet" className="d-flex flex-column flex-grow-1"><Aircraft /></NavTabs.Tab>
                <NavTabs.Tab name="Work Packages"><Packages /></NavTabs.Tab>
                <NavTabs.Tab name="Connector Finder"><ConnectorFinder /></NavTabs.Tab>
            </NavTabs>
        </div>
    )
}