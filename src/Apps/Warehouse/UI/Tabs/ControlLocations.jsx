import React, { useContext, useEffect, useRef, useState } from 'react'
import { HomeContext } from '../../../../Pages/HomePage/HomeContext'
import { WarehouseContext } from '../../warehouseContext';
import Warehouse from '../../Core/Warehouse';
import { useRecoilValue } from 'recoil';
import { $Server, $Token } from '../../../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import FormField from '../Components/FormField';
import useWarehouse from '../Hooks/useWarehouse';


export default function ControlLocations() {
  const serverUrl = useRecoilValue($Server);
  const token = useRecoilValue($Token);
  const { openModal2, refreshIndex } = useContext(HomeContext);
  const { activeWarehouse } = useContext(WarehouseContext);
  const [locations, setLocations] = useState([]);
  const [view, setView] = useState([]);
  const warehouse = new Warehouse(activeWarehouse);

  useEffect(() => {
    warehouse.refreshLocations(serverUrl, token).then(() => {
      setLocations(warehouse.locations);
      setView(warehouse.locations);
    });
  }, [refreshIndex]);

  const srarchInput = useRef();
  const handleSearch = () => {
    let val = srarchInput.current.value;
    setView(locations.filter(el => el.location_name.toLowerCase().includes(val.toLowerCase())));
  }

  return (
    <div className='col-12 flex-grow-1 d-flex flex-column flex-wrap py-3 align-items-start justify-content-start animate__animated animate__fadeIn' style={{ height: "1rem" }}>
      <div className='col-12 d-flex align-items-between justify-content-between'>
        <h5>Locations List</h5>
        <button className='addBtn btn' onClick={() => { openModal2(8002) }}>
          + New Location
        </button>
      </div>
      <div className='col-12 d-flex content flex-wrap flex-grow-1 align-content-start justify-content-start overflow-auto' style={{ height: "1rem" }}>
        <FormField>
          <FormField.Input ref={srarchInput} onChange={handleSearch} className="form-control" placeholder="Search Location" />
        </FormField>
        <table className='table table-dark table-bordered text-center'>
          <thead>
            <tr>
              <th>-</th>
              <th>Location Name</th>
              <th>Location Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              view.map((el, index) => {
                return (
                  <tr key={el.location_id}>
                    <td>{index + 1}</td>
                    <td>{el.location_name}</td>
                    <th>
                      <div className='col-12 d-flex justify-content-center gap-2'>
                        <FontAwesomeIcon className='btn btn-warning' icon={faEdit} />
                        <FontAwesomeIcon className='btn btn-primary' icon={faArrowRightArrowLeft} onClick={() => useWarehouse().editLocation(serverUrl, token, el)} />
                        <FontAwesomeIcon className='btn btn-danger' icon={faTrash} onClick={() => useWarehouse().removeLocation(serverUrl, token, el)} />
                      </div>
                    </th>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
