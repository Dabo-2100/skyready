import "./index.scss";
import NavTabs from "../../../Apps/Warehouse/UI/Components/NavTabs";
import Aircraft from "../ui/tabs/Aircraft";
// import Packages from "../ui/tabs/Packages";
// import Specialties from "../ui/tabs/Specialties";
// import WorkingZones from "../ui/tabs/WorkingZones";

export default function FleetApp() {
    return (
        <div className="tabApp d-flex flex-column" id="FleetApp" >
            <NavTabs style={{ height: "100vh" }}>
                <NavTabs.Tab name="Aircraft Fleet" className="d-flex flex-column flex-grow-1"><Aircraft /></NavTabs.Tab>
                <NavTabs.Tab name="Aircraft Fleet" className="d-flex flex-column flex-grow-1"><Aircraft /></NavTabs.Tab>
                {/* <NavTabs.Tab name="Work Packages"><Packages /></NavTabs.Tab>
                <NavTabs.Tab name="Specialties"><Specialties /></NavTabs.Tab>
                <NavTabs.Tab name="Zones & Areas"><WorkingZones /></NavTabs.Tab> */}
                {/* <NavTabs.Tab name="Connectors"><WorkingZones /></NavTabs.Tab> */}
            </NavTabs>
        </div>
    )
}