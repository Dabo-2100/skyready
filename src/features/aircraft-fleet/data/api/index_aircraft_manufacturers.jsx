import axios from "axios"

export const indexAircraftManufacturers = async (serverUrl, token) => {
    let final = [];
    await axios.get(`${serverUrl}/php/index.php/api/manufacturers`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        if (res.data.data) { final = [...res.data.data]; }
    }).catch((err) => { console.log(err); })
    return final;
}