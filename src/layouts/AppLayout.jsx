import { Outlet } from "react-router-dom";
import SideMenu from "../shared/ui/components/SideMenu";
import { useEffect, useState } from "react";
import useAuthentication from "../shared/ui/hooks/useAuthentication";
import { useSelector } from "react-redux";
import { allModals } from "../Pages/HomePage/Modals";

export default function AppLayout() {
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

    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const [authCheck, setAuthCheck] = useState(false);
    const { checkUserAuthority } = useAuthentication();

    useEffect(() => {
        checkUserAuthority().then(setAuthCheck);
        //eslint-disable-next-line
    }, [refreshIndex]);

    return (
        <>
            {authCheck &&
                <div className="col-12 h-100 d-flex flex-column flex-lg-row animate__animated animate__fadeIn">
                    <SideMenu />
                    <div className="flex-grow-1 h-100 overflow-auto d-flex">
                        <Outlet />
                    </div>
                    {renderModalLayer1()}
                    {renderModalLayer2()}
                    {renderModalLayer3()}
                    {renderModalLayer4()}
                </div>
            }
        </>
    )
}
