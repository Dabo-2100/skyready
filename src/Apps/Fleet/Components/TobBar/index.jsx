import { useContext } from "react";
import "./index.scss";
import { FleetContext } from "../../FleetContext";
export default function TopBar() {
    const tabs = ["Aircraft Fleet", "Work Packages", "Specialties", "Working Areas", "Designators"];
    const { tabIndex, setTabIndex } = useContext(FleetContext)
    return (
        <div className="col-12 text-white fleetTopBar">
            <ul className="col-12 m-0 p-0 d-flex flex-wrap list-unstyled">
                {
                    tabs.map((tab, index) => {
                        return (<li onClick={() => setTabIndex(index)} key={index} className={`py-3 px-3 ${index == tabIndex ? 'activeLink' : null}`}>{tab}</li>)
                    })
                }
            </ul>
        </div>
    )
}
