import axios from "axios"

export const indexTaskOperators = async (serverUrl, token, log_task_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/project/task/operators/${log_task_id}`, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}