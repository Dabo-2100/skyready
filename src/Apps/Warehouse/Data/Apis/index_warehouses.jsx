import axios from "axios";

export async function warehousesIndex(serverUrl, token) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/warehouses`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { if (res.data.data) { final = [...res.data.data] } })
    return final;
}