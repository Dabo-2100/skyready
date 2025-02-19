import axios from "axios"

export const updateTaskStatus = async (serverUrl, token, log_id, data) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/project/task/update/${log_id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}