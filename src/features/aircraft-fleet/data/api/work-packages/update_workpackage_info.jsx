import axios from "axios"

export const updateWorkPackageInfo = async (serverUrl, token, data, work_package_id) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/packages/update/${work_package_id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}