import axios from "axios"

export const indexAircraftDesignators = async (serverUrl, token, model_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/designators/${model_id}`, { headers: { Authorization: `Bearer ${token}` }, }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}