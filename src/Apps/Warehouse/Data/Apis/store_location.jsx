import axios from "axios";

export async function storeLocation(serverUrl, token, obj) {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/warehouses/locations/store`, obj, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data.data })
    return final;
}