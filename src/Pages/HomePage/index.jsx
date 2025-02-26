import "./index.scss";
import { useEffect, useState } from "react";
// System Apps
import FleetApp from "../../features/aircraft-fleet/app";
import ProjectsApp from "../../features/project-manager/app/index.jsx";
import UsersApp from "../../features/users/app";
import { useRecoilState } from "recoil";
import { allModals } from "./Modals.jsx";
import useAuthentication from "../../shared/ui/hooks/useAuthentication.jsx";
import { $UserInfo } from "../../store-recoil";
import { useSelector } from "react-redux";
import SideMenu from "../../shared/ui/components/SideMenu/index.jsx";
import WelcomePage from "../../shared/ui/components/WelcomePage/index.jsx";

export default function HomePage() {
    const [, setUserInfo] = useRecoilState($UserInfo);
    const [isChecked, setIsChecked] = useState(false);
    const { checkUserToken } = useAuthentication();
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    const modalIndex = useSelector(state => state.home.modals.layerOneIndex);
    const modal2Index = useSelector(state => state.home.modals.layerTwoIndex);
    const modal3Index = useSelector(state => state.home.modals.layerThreeIndex);
    const modal4Index = useSelector(state => state.home.modals.layerFourIndex);

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
            case 6:
                return <UsersApp />;
            default:
                return <WelcomePage />;
        }
    };

    useEffect(() => {
        checkUserToken().then((res) => { setUserInfo(res); setIsChecked(true) })
        // eslint-disable-next-line
    }, []);

    return (
        <div className="col-12 d-flex flex-column flex-lg-row" id="HomePage">
            <SideMenu />
            {isChecked && renderContent()}
            {renderModalLayer1()}
            {renderModalLayer2()}
            {renderModalLayer3()}
            {renderModalLayer4()}
        </div >
    )
}