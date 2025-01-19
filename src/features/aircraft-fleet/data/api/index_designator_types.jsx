import axios from "axios"

export const indexDesignatorTypes = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/designators/types`, { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}