import axios from "axios"

export const indexRemainTasks = async (serverUrl, data) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/report/final/remian`, data).then((res) => {
        if (res.data.data) { final = [...res.data.data] }
    }).catch((err) => { console.log(err); })
    return final;
}