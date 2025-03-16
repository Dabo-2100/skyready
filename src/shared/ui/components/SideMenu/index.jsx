import Swal from 'sweetalert2';
import Logo from "@/assets/IPACOLogo.png";
import styles from "./index.module.css"
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { $Token, $SwalDark } from '@/store-recoil';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoPower } from "react-icons/io5";
import { useAuth } from '../../../../store-zustand';

export default function SideMenu() {
    const [activePath, setActivePath] = useState();
    const navigate = useNavigate();
    const [, setToken] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [isPhone, setIsPhone] = useState(false);
    const { userInfo, apps: Apps, resetUserInfo } = useAuth();
    const location = useLocation();

    const onlyAuthor = () => (
        Apps.filter(el => (userInfo.user_roles.some(role => role.app_id == el.id) && el))
    )
    
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
                resetUserInfo();
                setToken(null);
                navigate('/login');
            }
        })
    }

    useEffect(() => {
        window.innerWidth <= '991' ? setIsPhone(true) : setIsPhone(false);
        window.addEventListener("resize", () => {
            window.innerWidth <= '991' ? setIsPhone(true) : setIsPhone(false);
        });
    }, []);

    useEffect(() => { setActivePath(location.pathname) }, [location]);
    return (
        <div id={styles.SideMenu} className='d-flex align-content-start flex-wrap gap-lg-3'>
            {
                !isPhone &&
                <header className='col-12 p-lg-4 d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center gap-3'>
                        <img src={Logo} width={35} />
                        <h1 className='fs-5'>SkyReady</h1>
                    </div>
                </header>
            }

            <main className='col-12 d-flex flex-lg-wrap px-lg-4 align-items-start gap-2'>
                {userInfo && onlyAuthor().map((el, index) => (
                    <Link
                        key={index}
                        to={el.path}
                        style={{ order: `${el['app_order']}`, width: isPhone ? `calc(100% / ${Apps.length})` : `100%` }}
                        className={`d-flex flex-column flex-lg-row align-items-center gap-3 py-4 py-lg-2 ${activePath && activePath.includes(el.path) ? styles.activeLink : null} `}
                    >
                        {el.icon}
                        <p className='mb-0 text-center text-lg-start'>{el.name}</p>
                    </Link>
                ))}
            </main>
            <footer onClick={logout} style={{ cursor: "pointer" }} className='col-12 d-flex text-center align-items-center text-white justify-content-center gap-3 p-3'>
                <IoPower />
                <p>Logout</p>
            </footer>
        </div>
    )
}