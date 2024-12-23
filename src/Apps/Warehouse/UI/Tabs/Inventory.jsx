import React, { useContext, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { $Server, $Token, $LoaderIndex } from '../../../../store'
import { inventoryRepo } from '../../Data/Repos/inventoryRepo';
import { User } from '../../Core/User';
import { HomeContext } from '../../../../Pages/HomePage/HomeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '../../Core/Store';
import { WarehouseContext } from '../../warehouseContext';

export default function Warehouses() {
    const { refreshIndex, openModal } = useContext(HomeContext);
    const { setActiveWarehouse } = useContext(WarehouseContext);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [warehouses, setWarehouses] = useState([]);
    const user = new User();
    useEffect(() => {
        setLoaderIndex(true);
        inventoryRepo.get_warehouses(serverUrl, token).then((res) => {
            const store = new Store(res);
            store.setCache();
            setTimeout(() => { setLoaderIndex(false); }, 600)
            setWarehouses(res);
        });
    }, [refreshIndex]);

    return (
        <div className='col-12 p-3 d-flex flex-column p-3 flex-grow-1'>
            <header className='d-flex pb-3 flex-wrap align-items-center justify-content-between'>
                <h5 className='m-0'>Warehouse List</h5>
                {
                    user.isAdmin() && (<button onClick={() => openModal(8000)} className='btn addBtn d-flex align-items-center gap-2'><FontAwesomeIcon icon={faAdd} /> New Warehouse</button>)
                }
            </header>
            <main className='col-12 d-flex flex-flex-grow-1 overflow-auto'>
                <table className='table table-dark'>
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Warehouse Name</th>
                            <th>Warehouse Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map((el, index) => {
                            return (
                                <tr key={index} onClick={() => { openModal(8001); setActiveWarehouse(el) }}>
                                    <th>{index + 1}</th>
                                    <th>{el.warehouse_name}</th>
                                    <th>
                                        {
                                            (el.is_admin == true) ? (

                                                <div className='col-12 d-flex align-items-center gap-3 justify-content-center'>
                                                    <button className='btn btn-warning'><FontAwesomeIcon icon={faEdit} /></button>
                                                    <button className='btn btn-danger'><FontAwesomeIcon icon={faTrash} /></button>
                                                </div>
                                            ) : "-"
                                        }
                                    </th>
                                </tr>)
                        })}
                    </tbody>
                </table>
            </main>
        </div>
    )
}