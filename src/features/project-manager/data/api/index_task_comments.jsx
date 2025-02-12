import axios from "axios"

export const indexTaskComments = async (serverUrl, token, task_id, data) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/workpackage/tasks/comments/${task_id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        if (res.data.data) { final = res.data.data; }
    }).catch((err) => { console.log(err) })
    return final;
}