import axios from "axios"

export const deleteProject = async (serverUrl, token, project_id) => {
    let final;
    await axios.get(`${serverUrl}/php/index.php/api/projects/remove/${project_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}