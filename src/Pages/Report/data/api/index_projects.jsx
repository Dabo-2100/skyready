import axios from "axios"

export const indexProject = async (serverUrl) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/report/final`).then((res) => {
        if (res.data.data) { final = [...res.data.data] }
    }).catch((err) => { console.log(err); })
    return final;
}