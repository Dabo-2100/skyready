import { useRecoilValue } from "recoil";
import { $Server, $Token } from "../store";
import axios from "axios";

export default function useAircraft() {
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const aircraftFleet = async () => {
        let final = [];
        await axios.get(`${serverUrl}/php/index.php/api/aircraft`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }

    const aircraftZones = async (model_id = 0) => {
        let final = [];
        await axios.get(`${serverUrl}/php/index.php/api/aircraft/zones/${model_id}`, { headers: { Authorization: `Bearer ${token}` }, }
        ).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }
    return { aircraftFleet, aircraftZones }
}
