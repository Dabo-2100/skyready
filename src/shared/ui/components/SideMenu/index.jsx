import Swal from 'sweetalert2';
import Logo from "@/assets/IPACOLogo.png";
import './index.scss';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { $UserInfo, $Token, $SwalDark } from '@/store-recoil';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveIndex } from '../../../state/activeAppIndexSlice';
import { IoPower } from "react-icons/io5";
import { GiCommercialAirplane } from "react-icons/gi";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaUsersGear } from "react-icons/fa6";

export default function SideMenu() {
    const navigate = useNavigate();
    const [userInfo] = useRecoilState($UserInfo);
    const [, setToken] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [isPhone, setIsPhone] = useState(false);
    const dispatch = useDispatch();
    const appIndex = useSelector(state => state.home.activeAppIndex.value);

    const Apps = [
        { id: 1, name: "Fleet Manager", icon: <GiCommercialAirplane className='appIcon' /> },
        { id: 2, name: "Project Manager", icon: <FaRegCalendarCheck className='appIcon' /> },
        { id: 3, name: "Report Manager", icon: <GiCommercialAirplane className='appIcon' /> },
        { id: 4, name: "Form Manager", icon: <GiCommercialAirplane className='appIcon' /> },
        { id: 5, name: "Warehose Manager", icon: <GiCommercialAirplane className='appIcon' /> },
        { id: 6, name: "Users Manager", icon: <FaUsersGear className='appIcon' /> },
    ]
    const showIocn = (id) => {
        return Apps.find(el => el.id == id).icon;
    }
    useEffect(() => {
        window.innerWidth <= '991' ? setIsPhone(true) : setIsPhone(false);
        window.addEventListener("resize", () => {
            window.innerWidth <= '991' ? setIsPhone(true) : setIsPhone(false);
        });
    }, [])

    const logout = () => {
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to exit ?",
            showDenyButton: true,
            denyButtonText: "No",
            confirmButtonText: "Yes",
            customClass: darkSwal
        }).then((res) => {
            if (res.isConfirmed) {
                localStorage.removeItem("$Token");
                sessionStorage.removeItem("$Token");
                setToken(null);
                navigate('/login');
            }
        })
    }

    return (
        <div
            id="SideMenu"
            className='d-flex align-content-start flex-wrap gap-lg-3'
        >
            {
                !isPhone ?
                    (
                        <header className='col-12 p-lg-4 d-flex align-items-center justify-content-between'>
                            <div className='d-flex align-items-center gap-3'>
                                <img src={Logo} width={35} />
                                <h1 className='fs-5'>SkyReady</h1>
                            </div>
                        </header>
                    ) : null
            }
            <main className='col-12 d-flex flex-lg-wrap px-lg-4 align-items-start gap-2'>
                {userInfo.user_roles.map((el, index) => {
                    return (
                        <div
                            onClick={() => dispatch(setActiveIndex(el['app_order']))}
                            key={index}
                            style={{ order: `${el['app_order']}`, width: isPhone ? `calc(100% / ${userInfo.user_roles.length})` : `100%` }}
                            className={`d-flex flex-column flex-lg-row align-items-center gap-3 py-4 py-lg-2 app ${appIndex == el['app_order'] ? 'activeLink' : null} `}
                        >
                            {showIocn(el['app_id'])}
                            <p className='appName mb-0 text-center text-lg-start'>{el['app_name']}</p>
                        </div>
                    )
                })
                }
            </main>
            <footer onClick={logout} style={{ cursor: "pointer" }} className='col-12 d-flex align-items-center justify-content-center gap-3 p-3'>
                <IoPower />
                <p>Logout</p>
            </footer>
        </div>
    )
}