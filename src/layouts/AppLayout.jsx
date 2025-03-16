import { Outlet } from "react-router-dom";
import SideMenu from "../shared/ui/components/SideMenu";
import { useEffect } from "react";
import { useAuth } from "../store-zustand";

export default function AppLayout() {
    const { userInfo, setUserInfo } = useAuth();
    useEffect(() => { !userInfo && setUserInfo() }, []);
    return (
        <div className="col-12 h-100 d-flex flex-column flex-lg-row">
            <SideMenu />
            <div className="flex-grow-1 h-100 overflow-auto d-flex">
                <Outlet />
            </div>
        </div>
    )
}
