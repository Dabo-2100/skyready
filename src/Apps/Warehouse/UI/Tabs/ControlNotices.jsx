import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react'
import { HomeContext } from '../../../../Pages/HomePage/HomeContext';

export default function ControlNotices() {
  const { openModal2 } = useContext(HomeContext)
  const [notices, setNotices] = useState([]);
  const newNotice = () => {
    openModal2(8006);
  }
  return (
    <div className='col-12 d-flex flex-wrap h-100 overflow-auto'>

      <div className='col-12 col-md-7 h-100 d-flex flex-wrap align-items-start overflow-auto'>
        <div className='col-4 gap-3 p-3 btn addBtn d-flex flex-column align-items-center' onClick={newNotice}>
          <FontAwesomeIcon icon={faFileCirclePlus} style={{ fontSize: "2rem" }} />
          <h5>New Notice</h5>
        </div>
      </div>

      <div style={{ border: "2px solid white" }} className='col-12 col-md-5 h-100 d-flex flex-column p-3 overflow-auto'>
        <h5>Latest Notices</h5>
        {
          notices.length > 0 ?
            (<table className='table table-bordered table-hover table-dark'>
              <thead>
                <tr>
                  <th>-</th>
                  <th>Notice Number</th>
                  <th>Notice Date</th>
                  <th>Done By</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>) : <h6 className='col-12 text-center pt-3'>There are no notices Yet.</h6>
        }
      </div>

    </div>
  )
}
