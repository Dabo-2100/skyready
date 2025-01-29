import axios from "axios"

export const showProjectFilteredPackages = async (serverUrl, token, project_id, obj) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/project/workpackages/filter/${project_id}`, obj, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}