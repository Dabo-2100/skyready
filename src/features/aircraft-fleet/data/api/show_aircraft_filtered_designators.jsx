import axios from "axios"

export const showFilteredDesignators = async (serverUrl, token, data) => {
    let final = [];
    await axios.post(`${serverUrl}/php/index.php/api/aircraft/designators/search`, data, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}