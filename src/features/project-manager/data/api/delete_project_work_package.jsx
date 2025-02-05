import axios from "axios"

export const deleteProjectWorkPackage = async (serverUrl, token, project_id, package_id) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/project/${project_id}/workpackages/${package_id}/remove`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}