import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { HomeContext } from '../../../../Pages/HomePage/HomeContext'
import { warehouseRepo } from '../../Data/Repos/warehouseRepo';
import { useRecoilValue } from 'recoil';
import { $Server, $Token } from '../../../../store';

export default function ControlItems() {
    const { openModal2, refreshIndex } = useContext(HomeContext);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const [items, setItems] = useState([]);
    const [page, setMore] = useState(0);
    const [maxRows, setMaxPage] = useState(0);
    useEffect(() => {
        warehouseRepo.all_items(serverUrl, token, page).then((res) => {
            setMaxPage(res.data.row_count)
            setItems([...items, ...res.data.items])
        });
    }, [page]);

    useEffect(() => {
        warehouseRepo.all_items(serverUrl, token, 0).then((res) => {
            setMaxPage(res.data.row_count)
            setItems([...items, ...res.data.items])
        });
    }, [refreshIndex]);

    return (
        <div className='col-12 d-flex flex-column flex-wrap flex-grow-1 p-3 gap-3 '>
            <div className='col-12 d-flex justify-content-between align-items-center'>
                <h5 className='m-0'>Items List</h5>
                <div className='d-flex align-items-center gap-3'>
                    <FontAwesomeIcon className='btn btn-primary' icon={faUpload} />
                    <button className='btn addBtn' onClick={() => openModal2(8003)}>+ New Item</button>
                </div>
            </div>
            <div className='col-12 flex-grow-1 overflow-auto' style={{ height: "1rem" }}>
                <table className='table table-dark text-center table-bordered table-hover'>
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Item P/N</th>
                            <th>Item Name</th>
                            <th>Item S/N</th>
                            <th>Item NSN</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            items.map((el, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <th>{el.item_pn}</th>
                                        <th>{el.item_name}</th>
                                        <th>{el.item_sn}</th>
                                        <th>{el.item_nsn}</th>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                {
                    Math.ceil(maxRows / 25) > page &&
                    <button className='btn btn-primary' onClick={() => setMore(page + 1)}>Load More</button>
                }
            </div>
        </div >
    )
}
