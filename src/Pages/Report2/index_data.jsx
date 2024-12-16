import axios from "axios";

export async function indexData(serverUrl, token) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/report/2`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = res.data })
    return final;
}