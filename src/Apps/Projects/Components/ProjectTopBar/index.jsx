import "./index.scss";
import { useContext } from "react";
import { ProjectsContext } from "../../ProjectContext";
export default function ProjectTopBar() {
    const tabs = ["Dashboard", "Tasks", "Reports"];
    const { projectTabIndex, setProjectTabIndex } = useContext(ProjectsContext)
    return (
        <div className="col-12 text-white fleetTopBar">
            <ul className="col-12 m-0 p-0 d-flex flex-wrap list-unstyled">
                {
                    tabs.map((tab, index) => {
                        return (<li onClick={() => setProjectTabIndex(index)} key={index} className={`py-3 px-3 ${index == projectTabIndex ? 'activeLink' : null}`}>{tab}</li>)
                    })
                }
            </ul>
        </div>
    )
}
