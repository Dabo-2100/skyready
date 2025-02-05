import axios from "axios"

export const storeProject = async (serverUrl, token, data) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/projects/store`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}