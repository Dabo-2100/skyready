import axios from "axios"

export const updateAircraftInfo = async (serverUrl, token, data, aircraft_id) => {
    let final;
    let obj = {
        table_name: "app_aircraft",
        condition: `aircraft_id = ${aircraft_id}`,
        data: data
    }
    await axios.post(`${serverUrl}/php/index.php/api/aircraft/update`, obj, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
        final = res.data.err ? res.data.msg.errorInfo[2] : true;
    }).catch(() => { })
    return final;
}