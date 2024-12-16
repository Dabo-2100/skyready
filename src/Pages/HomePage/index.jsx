import "./index.scss";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeContext } from "./HomeContext.jsx";

// System Apps
import FleetApp from "@/Apps/Fleet";
import ProjectsApp from "@/Apps/Projects/index.jsx";
import UsersApp from "@/Apps/Users";
import FormsApp from "@/Apps/Forms";
import WelcomePage from "@/Components/WelcomePage/index.jsx";
import SideMenu from "@/Components/SideMenu";

import { $Server, $Token, $UserInfo } from "@/store";
import { useRecoilState } from "recoil";
import axios from "axios";

import { ProjectsProvider } from "@/Apps/Projects/ProjectContext.jsx";
import { FleetProvider } from "@/Apps/Fleet/FleetContext.jsx";
import { UserProvider } from "../../Apps/Users/UserContext.jsx";
import WarehouseApp from "../../Apps/Warehouse/App/index.jsx";
import { WarehouseProvider } from "../../Apps/Warehouse/warehouseContext.jsx";
import { allModals } from "./Modals.jsx";


export default function HomePage() {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(false);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setUserInfo] = useRecoilState($UserInfo);
    const { appIndex, modalIndex, modal2Index, modal3Index, modal4Index, closeModal } = useContext(HomeContext);

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
                return <FormsApp />;
            case 5:
                return <WarehouseApp />;
            case 6:
                return <UsersApp />;
            default:
                return <WelcomePage />;
        }
    };

    useEffect(() => {
        if (token) {
            axios
                .post(`${serverUrl}/php/index.php/api/auth/check`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    if (!res.data.err) {
                        setUserInfo(res.data.data[0]);
                        setIsChecked(true);
                    }
                    else {
                        navigate('/login');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    navigate('/login');
                });
        }
        else {
            navigate('/login');
        }
    }, []);


    return (
        <>
            {
                isChecked && <div className="col-12 d-flex flex-column flex-lg-row" id="HomePage">
                    <SideMenu />
                    <FleetProvider>
                        <ProjectsProvider>
                            <UserProvider>
                                <WarehouseProvider>
                                    {renderContent()}
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