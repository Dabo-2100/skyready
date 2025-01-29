import axios from "axios"

export const indexWorkPackageTasks = async (serverUrl, token, project_id, package_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/project/${project_id}/workpackages/${package_id}/tasks`, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}