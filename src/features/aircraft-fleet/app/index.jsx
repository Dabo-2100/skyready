import "./index.css";
import Aircraft from "../ui/tabs/Aircraft";
import Packages from "../ui/tabs/Packages";
import NavTabs from "../../../shared/ui/components/NavTabs";
import ConnectorFinder from "../ui/tabs/ConnectorFinder";

export default function FleetApp() {
    return (
        <div className="tabApp d-flex flex-column" id="FleetApp" >
            <NavTabs style={{ height: "100vh" }}>
                <NavTabs.Tab name="Aircraft Fleet" className="d-flex flex-column flex-grow-1"><Aircraft /></NavTabs.Tab>
                <NavTabs.Tab name="Work Packages"><Packages /></NavTabs.Tab>
                <NavTabs.Tab name="Connector Finder"><ConnectorFinder /></NavTabs.Tab>
            </NavTabs>
        </div>
    )
}