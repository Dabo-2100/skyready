import "./index.scss";
import { useContext } from "react";
import { ProjectsContext } from "../../ProjectContext";
import { useRecoilValue } from "recoil";
import { $UserInfo } from "../../../../store";
import { User } from "../../../../shared/core/User";
import { useSelector } from "react-redux";
export default function TopBar() {
    const tabs = ["All Projects", "Analytics", "Fleet Grantt"];
    const { tabIndex, setTabIndex } = useContext(ProjectsContext)
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    const user = new User(useRecoilValue($UserInfo));
    return (


        <div className="col-12 text-white fleetTopBar">
            <ul className="col-12 m-0 p-0 d-flex flex-wrap list-unstyled">
                {
                    tabs.map((tab, index) => {
                        if (user.isAppAdmin(appIndex)) {
                            return (<li onClick={() => setTabIndex(index)} key={index} className={`py-3 px-3 ${index == tabIndex ? 'activeLink' : null}`}>{tab}</li>)
                        }
                    })
                }
            </ul>
        </div>
    )
}
