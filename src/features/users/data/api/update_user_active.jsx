import axios from "axios"

export const updateUserActive = async (serverUrl, token, user_id) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/users/hard-activate/${user_id}`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}