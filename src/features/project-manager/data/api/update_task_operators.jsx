import axios from "axios"

export const updateTaskOperators = async (serverUrl, token, log_id, operators) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/project/task/update/operators`, { log_id, operators }, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}