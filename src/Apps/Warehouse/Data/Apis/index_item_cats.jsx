import axios from "axios";

export async function indexCats(serverUrl, token) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/warehouses/cats`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}