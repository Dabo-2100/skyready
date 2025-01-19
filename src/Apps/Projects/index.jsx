import "./index.scss";
import NavTabs from "../Warehouse/UI/Components/NavTabs";
import ProjectsList from "./Tabs/ProjectsList";
import FleetGantt from "./Tabs/FleetGantt";
import { User } from "../../shared/core/User";
import { useRecoilValue } from "recoil";
import { $UserInfo } from "../../store";
import { useSelector } from "react-redux";

export default function ProjectsApp() {
    const user = new User(useRecoilValue($UserInfo));
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    return (
        <div className="tabApp d-flex" id="ProjectsApp" >
            <NavTabs>
                <NavTabs.Tab name="All Projects" className="flex-grow-1"><ProjectsList /></NavTabs.Tab>
                {user.isAppAdmin(appIndex) && <NavTabs.Tab name="Fleet Grantt"><FleetGantt /></NavTabs.Tab>}
            </NavTabs>
        </div >
    )
}
