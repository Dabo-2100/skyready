import axios from "axios";

export async function indexItems(serverUrl, token, page) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/warehouses/items/${page}`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}