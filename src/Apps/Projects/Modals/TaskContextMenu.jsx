import React, { useContext, useEffect } from 'react'
import { HomeContext } from '../../../Pages/HomePage/HomeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowsLeftRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FleetContext } from '../../Fleet/FleetContext';

export default function TaskContextMenu() {
    const { setTaskToEdit, setOpenPackage_id } = useContext(FleetContext);
    const { menu, setMenu, openModal2 } = useContext(HomeContext);
    useEffect(() => {
        return () => {// setTaskToEdit(0); setOpenPackage_id(0);
        }
    }, [])
    return (
        <div onContextMenu={(event) => { event.preventDefault(); setMenu({ index: true, posX: event.clientX, posY: event.clientY }) }} className='taskContextMenu' onClick={() => setMenu({ index: false, posX: 0, posY: 0 })}>
            <ul style={{ left: menu.posX, top: menu.posY }} className='bg-white position-absolute col-2 rounded shadow text-black list-unstyled'>
                <li onClick={() => { openModal2(4005); }} className='col-12 d-flex align-items-center ps-3 gap-3'><FontAwesomeIcon className='text-info' icon={faEdit} /> Edit Task</li>
                <li className='col-12 d-flex align-items-center ps-3 gap-3'><FontAwesomeIcon className='text-info' icon={faArrowsLeftRight} /> Switch Speciality</li>
                <li onClick={() => { openModal2(4003); }} className='col-12 d-flex align-items-center ps-3 gap-3'><FontAwesomeIcon className='text-info' icon={faAdd} /> New Task</li>
            </ul>
        </div>
    )
}
