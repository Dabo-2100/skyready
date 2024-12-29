import axios from "axios"

export const storeAircraftModel = async (serverUrl, token, data) => {
    let final;
    await axios.post(`${serverUrl}/php/index.php/api/aircraftmodels/store`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}