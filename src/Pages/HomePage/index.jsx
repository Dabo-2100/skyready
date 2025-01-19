import "./index.scss";
import { useContext, useEffect, useState } from "react";
import { HomeContext } from "./HomeContext.jsx";
// System Apps
import FleetApp from "../../features/aircraft-fleet/app";
import ProjectsApp from "@/Apps/Projects/index.jsx";
import UsersApp from "../../features/users/app";
import WelcomePage from "@/Components/WelcomePage/index.jsx";
import SideMenu from "@/Components/SideMenu";
import { useRecoilState } from "recoil";

import { ProjectsProvider } from "@/Apps/Projects/ProjectContext.jsx";
import { FleetProvider } from "@/Apps/Fleet/FleetContext.jsx";
import { UserProvider } from "../../features/users/UserContext.jsx";
import WarehouseApp from "../../Apps/Warehouse/App/index.jsx";
import { WarehouseProvider } from "../../Apps/Warehouse/warehouseContext.jsx";
import { allModals } from "./Modals.jsx";
import useAuthentication from "../../shared/ui/hooks/useAuthentication.jsx";
import { $UserInfo } from "../../store/index.js";
import { useSelector } from "react-redux";


export default function HomePage() {
    const [, setUserInfo] = useRecoilState($UserInfo);
    const [isChecked, setIsChecked] = useState(false);
    const { checkUserToken } = useAuthentication();
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    const { modalIndex, modal2Index, modal3Index, modal4Index } = useContext(HomeContext);

    const modals = [...allModals];

    const renderModalLayer1 = () => {
        const match = modals.find(item => item.index === modalIndex);
        return match ? match.component : null;
    };

    const renderModalLayer2 = () => {
        const match = modals.find(item => item.index === modal2Index);
        return match ? match.component : null;
    };

    const renderModalLayer3 = () => {
        const match = modals.find(item => item.index === modal3Index);
        return match ? match.component : null;
    };

    const renderModalLayer4 = () => {
        const match = modals.find(item => item.index === modal4Index);
        return match ? match.component : null;
    };

    const renderContent = () => {
        switch (appIndex) {
            case 1:
                return <FleetApp />;
            case 2:
                return <ProjectsApp />;
            case 3:
                return <WarehouseApp />;
            case 4:
                return <ProjectsApp />;
            case 5:
                return <ProjectsApp />;
            case 6:
                return <UsersApp />;
            default:
                return <WelcomePage />;
        }
    };

    useEffect(() => {
        checkUserToken().then((res) => { setUserInfo(res); setIsChecked(true) })
    }, []);

    return (
        <>
            {
                <div className="col-12 d-flex flex-column flex-lg-row" id="HomePage">
                    <SideMenu />
                    <FleetProvider>
                        <ProjectsProvider>
                            <UserProvider>
                                <WarehouseProvider>
                                    {isChecked && renderContent()}
                                    {renderModalLayer1()}
                                    {renderModalLayer2()}
                                    {renderModalLayer3()}
                                    {renderModalLayer4()}
                                </WarehouseProvider>
                            </UserProvider>
                        </ProjectsProvider>
                    </FleetProvider>
                </div >
            }
        </>
    )
}