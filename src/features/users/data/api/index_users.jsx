import axios from "axios"

export const indexUsers = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/users`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.data || [];
    }).catch(() => { });
    return final;
}