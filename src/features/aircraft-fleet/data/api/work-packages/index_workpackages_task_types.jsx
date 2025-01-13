import axios from "axios"

export const indexWorkPackagesTaskTypes = async (serverUrl, token, specialty_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/workpackage/tasks/types/specailty/${specialty_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}