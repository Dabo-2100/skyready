import { useRecoilState } from "recoil";
import { useContext, useEffect, useRef, useState } from "react";
import { FleetContext } from "../FleetContext";
import Select from "react-select";
import { $Server, $Token, $LoaderIndex, $UserInfo } from "@/store";
import { HomeContext } from "@/Pages/HomePage/HomeContext";
import { useAircraftModels, useAircraftZones, buildTree } from "../../../customHooks";
import TreeView from "../Components/Tree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
export default function WorkingZones() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [aircraftModels, setAircraftModels] = useState([]);
    const [loaderIndex, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [selectedModel, SetSelectedModel] = useState(0);
    const { openModal, refreshIndex } = useContext(HomeContext);
    const [zones, setZones] = useState([]);
    const { selectedZones, setSelectedZones, removeSelectedZone } = useContext(FleetContext);

    useEffect(() => {
        useAircraftModels(serverUrl, token).then((res) => { setAircraftModels(res) });
        return () => { setSelectedZones([]) };
    }, []);

    useEffect(() => {
        if (selectedModel != 0) {
            setSelectedZones([]);
            useAircraftZones(serverUrl, token, selectedModel).then((res) => {
                setZones(buildTree(res, "zone_id"));
            });
        }
    }, [selectedModel]);

    const getFilterData = () => {
        let zones_id = selectedZones.map(el => el.zone_id).toString(",");
        setLoaderIndex(true);
        axios.post(`${serverUrl}/php/index.php/api/aircraft/task/vs/zones`, { zones_id }, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            setLoaderIndex(false);
            openModal(2002);
            console.log(res.data);
        })
    }

    return (
        < div className="col-12 d-flex flex-wrap p-3 Tab" id="workingZones" >
            <div className="col-12 d-flex flex-column content rounded-4 animate__animated animate__fadeIn">
                <div className="col-12 actions gap-3 p-3 d-flex flex-wrap align-items-center justify-content-between">
                    <h5 className="m-0 text-white">Tasks vs Working Zones</h5>
                    <div className="col-12 col-md-4">
                        <Select
                            onChange={(newValue) => { SetSelectedModel(newValue.value) }}
                            placeholder="Select A/C Model" className="form-control"
                            options={aircraftModels.map((el) => { return { value: el.model_id, label: el.model_name } })}
                        >
                        </Select>
                    </div>
                </div>
                <div className="col-12 p-3 d-flex flex-wrap" style={{ height: "2vh", flexGrow: 1, overflow: "auto", borderTop: "1px solid #ffffff4d" }}>
                    {
                        selectedZones.length > 0 &&
                        <div className="col-12 d-flex align-items-start justify-content-between pb-3">
                            <div className="col-10 d-flex flex-wrap gap-3">
                                {
                                    selectedZones.map((el, index) => {
                                        return (
                                            <button
                                                key={el.zone_id}
                                                className="btn addBtn"
                                            >
                                                {el.zone_name}
                                                {/* <FontAwesomeIcon onClick={() => removeSelectedZone(el.zone_id)} icon={faX} /> */}
                                            </button>)
                                    })
                                }
                            </div>
                            <button className="btn btn-primary" onClick={() => getFilterData()}>Show Tasks</button>
                        </div>
                    }
                    <TreeView data={zones} type="zone" />
                    {/* action={isEdit ? 'edit' : null} */}
                </div>
            </div>
        </div >
    )
}
