import "./index.scss";
import { useContext } from "react";
import { ProjectsContext } from "../../ProjectContext";
import { User } from "../../../Warehouse/Core/User";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import { useRecoilState } from "recoil";
import { $UserInfo } from "../../../../store";
import NavTabs from "../../../Warehouse/UI/Components/NavTabs";
export default function TopBar() {
    const [userInfo] = useRecoilState($UserInfo);
    const tabs = ["All Projects", "Analytics", "Fleet Grantt"];
    const { tabIndex, setTabIndex } = useContext(ProjectsContext)
    const { appIndex } = useContext(HomeContext);
    const user = new User();
    return (


        <div className="col-12 text-white fleetTopBar">
            <ul className="col-12 m-0 p-0 d-flex flex-wrap list-unstyled">
                {
                    tabs.map((tab, index) => {
                        if (user.isAdmin()) {
                            return (<li onClick={() => setTabIndex(index)} key={index} className={`py-3 px-3 ${index == tabIndex ? 'activeLink' : null}`}>{tab}</li>)
                        }
                    })
                }
            </ul>
        </div>
    )
}
