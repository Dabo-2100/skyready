import axios from "axios"

export const indexWorkPackages = async (serverUrl, token, workpackage_type_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/packages/types/${workpackage_type_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}