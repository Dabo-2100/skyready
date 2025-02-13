import axios from "axios"

export const showDesignatorTasks = async (serverUrl, token, designator_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/designator/tasks/${designator_id}`, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = res.data.data; }
    }).catch((err) => { console.log(err); })
    return final;
}