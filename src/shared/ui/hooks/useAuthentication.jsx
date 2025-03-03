import { useRecoilValue } from "recoil"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { $Server, $Token } from "../../../store-recoil";
import { AuthRepo } from "../../data/repositories/AuthRepo";

export default function useAuthentication() {
    const navigate = useNavigate();
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);

    const checkToken = async () => {
        return await AuthRepo.check_user_token(serverUrl, token);
    }

    const userLogin = async (formInputs) => {
        let data = { user_email: formInputs.user_email, user_password: formInputs.user_password }
        return await AuthRepo.user_login(serverUrl, token, data);
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

    return { checkUserToken, checkToken, userLogin }
}
