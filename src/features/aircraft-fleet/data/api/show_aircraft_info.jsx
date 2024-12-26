import axios from "axios"

export const showAircraftInfo = async (serverUrl, token, aircarft_id) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/aircraft/${aircarft_id}`, { headers: { Authorization: `Bearer ${token}` } }
    ).then((res) => {
        if (res.data.data) { final = res.data.data[0]; }
    }).catch((err) => { console.log(err); })
    return final;
}