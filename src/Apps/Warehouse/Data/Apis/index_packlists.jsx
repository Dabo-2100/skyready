import axios from "axios";

export async function indexPacklists(serverUrl, token) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/warehouses/packlists`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}