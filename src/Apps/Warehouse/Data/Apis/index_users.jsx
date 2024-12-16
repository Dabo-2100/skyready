import axios from "axios";

export async function usersIndex(serverUrl, token) {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/warehouses/users`, {
        headers: { Authorization: `Bearer ${token}` },
    }).then((res) => { final = [...res.data.data] })
    return final;
}