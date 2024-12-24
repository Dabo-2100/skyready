import axios from "axios"

export const showUser = async (serverUrl, token, user_id) => {
    let final = undefined;
    await axios.get(`${serverUrl}/php/index.php/api/users/${user_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.data && res.data.data[0];
    }).catch(() => { });
    return final;
}