import axios from "axios"

export const indexProjectPackages = async (serverUrl, token, project_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/project/workpackages/${project_id}`, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}