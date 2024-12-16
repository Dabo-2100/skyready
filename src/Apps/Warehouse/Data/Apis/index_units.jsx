import axios from "axios";

export async function indexUnits(serverUrl, token) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/warehouses/units`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}