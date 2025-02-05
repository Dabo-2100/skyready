import { useContext, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { $Server, $Token } from "../../../../store";
import { useRecoilState } from "recoil";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import useWarehouse from "../Hooks/useWarehouse";
import { WarehouseContext } from "../../warehouseContext";
import SaveBtn from "../Components/SaveBtn";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import { useAircraftFleet } from "../../../../customHooks";

export default function NewNotice() {
    const { activeWarehouse } = useContext(WarehouseContext);
    const { refreshIndex, openModal3 } = useContext(HomeContext);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [rowNo, setRowNo] = useState(1)
    const [noticeRows, setNoticeRows] = useState([1]);
    // useRefs
    const dateInput = useRef();
    const itemsRefs = useRef([]);
    const locationsRefs = useRef([]);
    const unitsRefs = useRef([]);
    const qtyRefs = useRef([]);
    const packlistsRef = useRef([]);
    const aircraftRef = useRef([]);
    // useState
    const [units, setUnits] = useState([]);
    const [items, setItems] = useState([]);
    const [locations, setLocations] = useState([]);
    const [fleetAircraft, setFleetAricraft] = useState([]);
    const [packlists, setPacklists] = useState([]);

    useEffect(() => {
        useWarehouse().getAllItems(serverUrl, token).then((res) => {
            let final = res.data.items.map((el) => {
                return { value: el.item_id, label: el.item_pn }
            })
            setItems(final)
        });

        useWarehouse().getAllUnits(serverUrl, token).then((res) => {
            let final = res.data.map((el) => {
                return { value: el.unit_id, label: el.unit_name }
            })
            setUnits(final)
        });

        useWarehouse().getAllLocations(serverUrl, token, activeWarehouse.warehouse_id).then((res) => {
            let final = res.data.locations.map((el) => {
                return { value: el.location_id, label: el.location_name }
            })
            setLocations(final)
        })

        useAircraftFleet(serverUrl, token).then((res) => {
            let final = res.map((el) => {
                return { value: el.aircraft_id, label: el.aircraft_serial_no }
            })
            setFleetAricraft(final)
        })

        useWarehouse().getAllPacklists(serverUrl, token).then((res) => {
            let final = res.data.map((el) => {
                return { value: el.packlist_id, label: el.packlist_name }
            })
            setPacklists(final)
        })
    }, [refreshIndex]);

    const addRow = () => {
        setNoticeRows([...noticeRows, rowNo + 1]);
        setRowNo(rowNo + 1);
    }

    const removeRow = (index) => {
        let rows = [...noticeRows];
        rows.splice(index, 1);
        setNoticeRows([...rows]);
    }

    const saveNotice = () => {
        let final = {
            done_by: theUser.id,
            notice_date: dateInput.current.value,
            notice_type: "Add",
            warehouse_id: activeWarehouse.warehouse_id,
        }
        let rows = [];
        qtyRefs.current.forEach((el, index) => {
            let obj = {
                item_id: itemsRefs.current[index].props.value && itemsRefs.current[index].props.value.value,
                location_id: locationsRefs.current[index].props.value && locationsRefs.current[index].props.value.value,
                unit_id: unitsRefs.current[index].props.value && unitsRefs.current[index].props.value.value,
                packlist_id: packlistsRef.current[index].props.value && packlistsRef.current[index].props.value.value,
                aircraft_id: aircraftRef.current[index].props.value && aircraftRef.current[index].props.value.value,
                amount: +el.value,
            };
            rows.push(obj);
        });
        final.rows = rows;
    }

    return (
        <Modal id={"NoticeModal"}>
            <div className={"col-12 d-flex"}>
                <div className="col-12 px-3 gap-3 d-flex flex-wrap align-items-center justify-content-between">
                    <div className="col-12 d-flex align-items-center justify-content-between">
                        <h5 className="p-0 m-0">New Notice</h5>
                        <SaveBtn onClick={saveNotice} label={"Save"} />
                    </div>
                    <div className="col-12 d-flex flex-wrap align-items-center justify-content-between">
                        <div className="col-12 col-md-4">
                            <select className="form-select text-center fs-6">
                                <option>Add</option>
                                <option>Sub</option>
                            </select>
                        </div>
                        <div className="d-flex align-items-center col-12 col-md-4">
                            <label htmlFor="dateInput" className="pe-3 fs-5">Date</label>
                            <input ref={dateInput} className="form-control" id="dateInput" type="date" />
                        </div>
                    </div>
                </div>
            </div >
            <div className="col-12 d-flex h-25 flex-grow-1 p-3 pb-0">
                <div className="h-100 col-12 overflow-auto" style={{ paddingBottom: "10rem" }}>
                    <table id="noticeTable" className="table table-bordered text-center" style={{ verticalAlign: "middle", width: "120%" }}>
                        <thead>
                            <tr className="position-sticky top-0 z-3" style={{ top: "-1rem !important" }}>
                                <th>-</th>
                                <th>
                                    <div className="d-flex gap-3 align-items-center justify-content-between">
                                        Item P/N <button onClick={() => openModal3(8003)} className="btn addBtn">+</button>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                        Location <button onClick={() => openModal3(8002)} className="btn addBtn">+</button>
                                    </div>
                                </th>
                                <th>
                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                        Unit <button onClick={() => openModal3(8005)} className="btn addBtn">+</button>
                                    </div>

                                </th>
                                <th className="col-2">Quantity</th>
                                <th>
                                    <div className="d-flex gap-3 align-items-center justify-content-center">
                                        Packlist <button onClick={() => openModal3(8007)} className="btn addBtn">+</button>
                                    </div>
                                </th>
                                <th>Actions</th>
                                <th>For A/C</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                noticeRows.map((el, index) => {
                                    return (
                                        <tr key={el} style={{ fontSize: "8px !important" }}>
                                            <td>{index + 1}</td>
                                            <td><Select ref={(el) => { itemsRefs.current[index] = el }} className="form-control text-start" placeholder="Item P/N" options={items} /></td>
                                            <td><Select ref={(el) => { locationsRefs.current[index] = el }} className="form-control text-start" placeholder="Location" options={locations} /></td>
                                            <td><Select ref={(el) => { unitsRefs.current[index] = el }} className="form-control text-start" placeholder="Unit" options={units} /></td>
                                            <td><input ref={(el) => { qtyRefs.current[index] = el }} type="number" placeholder="Amount" className="form-control" /></td>
                                            <td><Select ref={(el) => { packlistsRef.current[index] = el }} className="form-control text-start" placeholder="packlist" options={packlists} /></td>
                                            <td><Select ref={(el) => { aircraftRef.current[index] = el }} className="form-control text-start" placeholder="A/C" options={fleetAircraft} /></td>
                                            <td>
                                                <div className="d-flex gap-3 justify-content-center align-items-center">
                                                    {
                                                        index == (noticeRows.length - 1) &&
                                                        <button className="btn btn-success py-1 px-2" onClick={addRow}><FontAwesomeIcon style={{ fontSize: "10px" }} icon={faPlus} /></button>
                                                    }
                                                    {
                                                        noticeRows.length > 1 &&
                                                        <button className="btn btn-danger py-1 px-2" onClick={() => removeRow(index)}><FontAwesomeIcon style={{ fontSize: "10px" }} icon={faX} /></button>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal >
    )
}