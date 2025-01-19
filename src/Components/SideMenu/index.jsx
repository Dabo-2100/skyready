import './index.scss';
import { useEffect, useState } from 'react';
import Logo from "@/assets/IPACOLogo.png";
import { useRecoilState } from 'recoil';
import { $UserInfo, $Token, $SwalDark } from '@/store';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faCalendar, faGears, faHouse, faJetFighter, faListCheck, faPowerOff, faUsers } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveIndex } from '../../shared/state/activeAppIndexSlice';
export default function SideMenu() {
    const navigate = useNavigate();
    library.add(faUsers, faListCheck, faBook, faJetFighter, faCalendar, faHouse, faGears);
    const [userInfo] = useRecoilState($UserInfo);
    const [, setToken] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const [isPhone, setIsPhone] = useState(false);
    const dispatch = useDispatch();
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    
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
                            style={{
                                order: `${el['app_order']}`,
                                width: isPhone ? `calc(100% / ${userInfo.user_roles.length})` : `100%`
                            }}
                            className={`d-flex flex-column flex-lg-row align-items-center gap-3 py-4 py-lg-2 app ${appIndex == el['app_order'] ? 'activeLink' : null} `}>
                            <FontAwesomeIcon className='appIcon' icon={`fa-solid ${el['app_icon']}`} />
                            <p className='appName mb-0 text-center text-lg-start'>{el['app_name']}</p>
                        </div>
                    )
                })
                }
            </main>
            <footer onClick={logout} style={{ cursor: "pointer" }} className='col-12 d-flex align-items-center justify-content-center gap-3 p-3'>
                <FontAwesomeIcon icon={faPowerOff} />
                <p>Logout</p>
            </footer>
        </div>
    )
}