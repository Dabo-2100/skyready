import { useRecoilValue } from "recoil"
import { $Server, $Token } from "../store"
import { useContext } from "react";
import { FleetContext } from "../Apps/Fleet/FleetContext";
import axios from "axios";

export default function useWorkPackage() {
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const { openPackage_id } = useContext(FleetContext);

    const taskTypes = async (specialty_id = 0) => {
        let final = [];
        await axios.get(`${serverUrl}/php/index.php/api/workpackage/tasks/types/specailty/${specialty_id}`, { headers: { Authorization: `Bearer ${token}` } }
        ).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }

    const specialties = async () => {
        let final = [];
        await axios.get(`${serverUrl}/php/index.php/api/specialties`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }

    const opendPackageInfo = async () => {
        let final = {};
        await axios.get(`${serverUrl}/php/index.php/api/packages/${openPackage_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            final = res.data.data.info;
        }).catch(err => console.log(err))
        return final;
    }

    return { opendPackageInfo, taskTypes, specialties }
}
