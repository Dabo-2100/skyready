import axios from "axios";

export async function locationsIndex(serverUrl, token, warehouse_id) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/warehouses/locations/${warehouse_id}`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}