import "./index.css";
import Logo from "@/assets/IPACOLogo.png";
import { useAuth } from "../../../../store-zustand";
export default function WelcomePage() {
    const { userInfo } = useAuth();

    return (
        <div className='col-12 d-flex align-items-center justify-content-center' id="WelcomePage">
            <div className="content d-flex flex-column align-content-center align-items-center">
                <img className="animate__animated animate__fadeInDown" src={Logo} width={200} />
                <h1 className="animate__animated animate__fadeInDown"> Welcome {userInfo.user_name}</h1>
            </div>
        </div>
    )
}
