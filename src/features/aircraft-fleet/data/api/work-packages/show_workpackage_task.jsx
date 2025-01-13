import axios from "axios"

export const showWorkPackageTaskInfo = async (serverUrl, token, active_work_package_task_id) => {
    let final = {};
    await axios.get(`${serverUrl}/php/index.php/api/workpackage/tasks/${active_work_package_task_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        if (res.data.data) { final = { ...res.data.data[0] }; }
    }).catch((err) => { console.log(err); })
    return final;
}