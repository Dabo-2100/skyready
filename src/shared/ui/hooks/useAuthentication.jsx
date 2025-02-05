import { useRecoilValue } from "recoil"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { $Server, $Token } from "../../../store-recoil";

export default function useAuthentication() {
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const navigate = useNavigate();

    const checkUserToken = async () => {
        let final = {};
        if (token) {
            await axios.post(`${serverUrl}/php/index.php/api/auth/check`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
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
    return { checkUserToken }
}
