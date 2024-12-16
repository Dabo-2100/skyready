import { useContext, useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import useWarehouse from "../Hooks/useWarehouse";
import { useRecoilValue } from "recoil";
import { $Server, $Token } from "../../../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function UnitsControl() {
    const [units, setUnits] = useState([]);
    const [editIndex, setEditIndex] = useState(false);
    const [catId, setCatId] = useState();
    const { refreshIndex, refresh } = useContext(HomeContext);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const catNameInput = useRef();

    const handleNewCat = () => {
        useWarehouse().addNewUnit(serverUrl, token, catNameInput.current.value).then(() => { refresh() })
    }

    useEffect(() => {
        useWarehouse().getAllUnits(serverUrl, token).then((res) => { setUnits(res.data) });
    }, [refreshIndex])

    useEffect(() => {
        if (catId) {
            catNameInput.current.value = units.find(el => el.unit_id == catId).unit_name
        }
    }, [catId]);
    return (
        <Modal>
            <div className="col-12 d-flex flex-wrap">
                <div className="col-12 d-flex align-items-center justify-content-between pb-2">
                    <h5>{editIndex ? "Change Unit Name" : "Add New Unit"}</h5>
                    {editIndex && <button className="btn btn-danger" onClick={() => setEditIndex(false)}><FontAwesomeIcon icon={faX} /></button>}
                </div>
                <div className="col-12 d-flex">
                    <input ref={catNameInput} type="text" className="form-control" placeholder="Enter New Name" />
                    <button className="btn addBtn" onClick={handleNewCat}>
                        {editIndex ? "Save Change" : "Add New"}
                    </button>
                </div>
            </div>
            <hr className="col-12" />
            <div className={"d-flex flex-wrap col-12"}>
                <h5 className="col-12">Units List</h5>
                <table className="table table-dark text-center">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Category Name</th>
                            <th>Category Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            units.map((el, index) => {
                                return (
                                    <tr key={el.unit_id}>
                                        <th>{index + 1}</th>
                                        <td>{el.unit_name}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <button onClick={() => { setEditIndex(true); setCatId(el.unit_id) }} className="btn btn-warning"><FontAwesomeIcon icon={faEdit} /> </button>
                                                <button className="btn btn-danger"><FontAwesomeIcon icon={faX} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </Modal>
    )
}
