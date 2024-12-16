import axios from "axios";

export async function storePacklist(serverUrl, token, obj) {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/warehouses/packlists/store`, obj, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}