import "./index.css";
// import NavTabs from "../../../Apps/Warehouse/UI/Components/NavTabs";
import ProjectsList from "../ui/tabs/ProjectsList";

export default function ProjectsApp() {
    return (
        <div className="d-flex tabApp" id="ProjectsApp" >
            <ProjectsList />
            {/* <NavTabs>
                <NavTabs.Tab name="All Projects" className="flex-grow-1"><ProjectsList /></NavTabs.Tab>
                <NavTabs.Tab name="All Projects" className="flex-grow-1"><ProjectsList /></NavTabs.Tab>
            </NavTabs> */}
        </div >
    )
}
