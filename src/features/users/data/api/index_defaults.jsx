import axios from "axios"

export const indexDefaults = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/roles`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.data || [];
    }).catch(() => { });
    return final;
}