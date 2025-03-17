import axios from "axios"

export const updateProgress = async (serverUrl, token, log_id, data) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/project/task/progress`, { ...data, log_id }, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}