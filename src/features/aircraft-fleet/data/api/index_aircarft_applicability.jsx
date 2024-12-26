import axios from "axios"

export const indexAircarftApplicability = async (serverUrl, token, aircarft_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/applicability/${aircarft_id}`, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}