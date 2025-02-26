import axios from "axios"

export const userLogin = async (serverUrl, token, data) => {
    let final;

    await axios.post(`${serverUrl}/php/index.php/api/auth/login`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data;
    })

    return final;
}