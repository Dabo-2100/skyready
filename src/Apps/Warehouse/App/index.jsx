import "./index.scss";
import NavTabs from "../UI/Components/NavTabs";
import Dashboard from "../UI/Tabs/Dashboard";
import Warehouses from "../UI/Tabs/Inventory";

export default function WarehouseApp() {
    return (
        <div className="col-12 tabApp" id="WarehouseApp">
            <NavTabs style={{ height: "100vh" }}>
                <NavTabs.Tab name="Dashboard"><Dashboard /></NavTabs.Tab>
                <NavTabs.Tab name="Inventory"><Warehouses /></NavTabs.Tab>
                <NavTabs.Tab name="Orders"><h1>Tab Not Ready Yet</h1></NavTabs.Tab>
            </NavTabs>
        </div>
    )
}
