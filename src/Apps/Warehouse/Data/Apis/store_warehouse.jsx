import axios from "axios";

export async function storeWarehouse(serverUrl, token, obj) {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/warehouses/store`, obj, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data.data })
    return final;
}