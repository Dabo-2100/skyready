import axios from "axios"
import { domain } from "../../../store-zustand";

export const userLogin = async (serverUrl, token, data) => {
    let final;

    await axios.post(`${domain}/php/index.php/api/auth/login`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data;
    })

    return final;
}