import axios from "axios"

export const showFilteredWorkPackages = async (serverUrl, token, project_id, package_id, obj) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/project/${project_id}/workpackages/filter/${package_id}/tasks`, obj, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}