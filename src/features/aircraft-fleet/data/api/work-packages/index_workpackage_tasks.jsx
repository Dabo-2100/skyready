import axios from "axios"

export const indexWorkPackageTasks = async (serverUrl, token, work_package_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/packages/${work_package_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        if (res.data.data) { final = { ...res.data.data } }
    }).catch((err) => { console.log(err); })
    return final;
}