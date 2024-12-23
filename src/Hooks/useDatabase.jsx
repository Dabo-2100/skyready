import { useRecoilValue } from "recoil";
import { $Server, $Token } from "../store";
import axios from "axios";

export default function useDatabase() {
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);

    const dbInsert = async (tableName, dataObj) => {
        let final = [];
        await axios.post(`${serverUrl}/php/index.php/api/insert`, {
            table_name: tableName,
            Fields: [...Object.keys(dataObj)],
            Values: [...Object.values(dataObj)],
        },
            { headers: { Authorization: `Bearer ${token}` }, }
        ).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }

    const dbSelect = async (query) => {
        let final = [];
        await axios.post(`${serverUrl}/php/index.php/api/get`, { query: query }, { headers: { Authorization: `Bearer ${token}` }, }).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }


    const dbUpdate = async (tableName, condition, data) => {
        let final = [];
        await axios.post(`${serverUrl}/php/index.php/api/update`, {
            table_name: tableName,
            condition: condition,
            data: data,
        },
            { headers: { Authorization: `Bearer ${token}` }, }
        ).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }


    const dbDelete = async (tableName, condition) => {
        let final = [];
        await axios.post(`${serverUrl}/php/index.php/api/delete`, {
            table_name: tableName,
            condition: condition,
        },
            { headers: { Authorization: `Bearer ${token}` }, }
        ).then((res) => {
            if (res.data.data) { final = [...res.data.data]; }
        }).catch((err) => { console.log(err); })
        return final;
    }

    return { dbInsert, dbSelect, dbUpdate, dbDelete }
}