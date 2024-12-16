import axios from "axios";

export async function storeUnit(serverUrl, token, obj) {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/warehouses/units/store`, obj, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}