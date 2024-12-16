import React, { useContext, useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faX } from '@fortawesome/free-solid-svg-icons';
import useWarehouse from '../Hooks/useWarehouse';
import { useRecoilValue } from 'recoil';
import { $Server, $Token } from '../../../../store';
import { HomeContext } from '../../../../Pages/HomePage/HomeContext';

export default function NewPacklist() {
    const { refreshIndex, closeModal } = useContext(HomeContext);
    const [packlists, setPacklists] = useState([]);
    const [editIndex, setEditIndex] = useState(false);
    const [packlistId, setPacklistId] = useState(false);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const packlistInput = useRef();
    const newPacklist = () => {
        useWarehouse().addNewPacklist(serverUrl, token, packlistInput.current.value).then(() => {
            closeModal()
        })
    }
    useEffect(() => {
        useWarehouse().getAllPacklists(serverUrl, token).then((res) => {
            setPacklists(res.data);
        });
    }, [refreshIndex]);
    return (
        <Modal>
            <div className="col-12 d-flex flex-wrap">
                <div className="col-12 d-flex align-items-center justify-content-between pb-2">
                    <h5>{editIndex ? "Change Unit Name" : "Add New Unit"}</h5>
                    {editIndex && <button className="btn btn-danger" onClick={() => setEditIndex(false)}><FontAwesomeIcon icon={faX} /></button>}
                </div>
                <div className="col-12 d-flex">
                    <input ref={packlistInput} type="text" className="form-control" placeholder="Enter New Name" />
                    <button className="btn addBtn" onClick={newPacklist}>
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
                            <th>Packlist Name</th>
                            <th>Packlist Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            packlists.map((el, index) => {
                                return (
                                    <tr key={el.packlist_id}>
                                        <th>{index + 1}</th>
                                        <td>{el.packlist_name}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <button onClick={() => { setEditIndex(true); setPacklistId(el.unit_id) }} className="btn btn-warning"><FontAwesomeIcon icon={faEdit} /> </button>
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
