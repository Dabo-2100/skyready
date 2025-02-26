import axios from "axios"

export const showUserInfoByToken = async (serverUrl, token) => {
    let final = undefined;
    await axios.post(`${serverUrl}/php/index.php/api/auth/check`, {}, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = { ...res.data.data[0] }; }
    }).catch((err) => { console.log(err); })
    return final;
}