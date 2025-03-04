import { useRecoilState } from "recoil";
import "./index.scss";
import Logo from "@/assets/IPACOLogo.png";
import { $UserInfo } from "@/store-recoil";
import { useEffect, useState } from "react";


export default function WelcomePage() {
    const [userInfo] = useRecoilState($UserInfo);
    const [updateIndex, setUpdateIndex] = useState(false);
    const updateSystem = () => {
        localStorage.clear();
        localStorage.setItem("UpdateDone", true);
        window.location.reload();
    }

    useEffect(() => {
        let x = localStorage.getItem("UpdateDone");
        if (x) { setUpdateIndex(true) }
    }, []);
    return (
        <div className='tabApp d-flex align-items-center justify-content-center' id="WelcomePage">
            <div className="content d-flex flex-column align-content-center align-items-center">

                <img className="animate__animated animate__fadeInDown" src={Logo} width={200} />
                <h1 className="animate__animated animate__fadeInDown"> Welcome {userInfo.user_name}</h1>
                {!updateIndex && <button className="btn addBtn" onClick={updateSystem}>Update System</button>}
            </div>
        </div>
    )
}
