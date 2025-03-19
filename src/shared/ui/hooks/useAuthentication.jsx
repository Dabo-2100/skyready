import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthRepo } from "../../data/repositories/AuthRepo";
import { useAuth, serverUrl, darkSwal, useToken } from "../../../store-zustand";
import Swal from "sweetalert2";

export default function useAuthentication() {
    const { apps, setUserInfo, resetUserInfo } = useAuth();
    const { token, resetToken } = useToken();
    const navigate = useNavigate();
    const location = useLocation();


    const checkToken = async () => {
        return await AuthRepo.user_info_by_token(serverUrl, token);
    }

    const checkUserAuthority = async () => {
        let path = location.pathname.split('/')[1];
        // check Token
        let user = await AuthRepo.user_info_by_token(serverUrl, token);
        if (!user) { navigate('/login'); return false }
        // check Authortiy
        if (path != '' && path != 'settings') {
            let activeAppId = apps.find(el => el.path == path).id;
            let hasAuthority = user.user_roles.find(el => el.app_id == activeAppId);
            if (!hasAuthority) { navigate('/403'); return false }
        }
        setUserInfo(user);
        return true
    }

    const userLogin = async (formInputs) => {
        let data = { user_email: formInputs.user_email, user_password: formInputs.user_password }
        return await AuthRepo.user_login(serverUrl, token, data);
    }

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
                localStorage.clear();
                sessionStorage.clear();
                resetToken()
                resetUserInfo();
                navigate('/login');
            }
        })
    }

    const checkUserToken = async () => {
        let final = {};
        if (token) {
            await axios.post(`${serverUrl}/php/index.php/api/auth/check`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            }).then((res) => {
                if (!res.data.err) { final = res.data.data[0] }
                else { navigate('/login') }
            }).catch(() => { navigate('/login') });
        }
        else {
            navigate('/login');
        }
        return final;
    }

    return { checkUserToken, checkToken, userLogin, checkUserAuthority, logout }
}
