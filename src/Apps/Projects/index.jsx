import "./index.scss";
import NavTabs from "../Warehouse/UI/Components/NavTabs";
import { User } from "../Warehouse/Core/User";
import ProjectsList from "./Tabs/ProjectsList";
import FleetGantt from "./Tabs/FleetGantt";

export default function ProjectsApp() {
    const user = new User();
    return (
        <div className="tabApp d-flex" id="ProjectsApp" >
            <NavTabs>
                <NavTabs.Tab name="All Projects" className="flex-grow-1"><ProjectsList /></NavTabs.Tab>
                {user.isAdmin() && <NavTabs.Tab name="Fleet Grantt"><FleetGantt /></NavTabs.Tab>}
            </NavTabs>
        </div >
    )
}
