import Modal from '../../Warehouse/UI/Modals/Modal'
import Select from 'react-select';
export default function AircraftZones() {
    return (
        <Modal>
            <div className='col-12 d-flex flex-column gap-2'>
                <label className='col-12'>Select A/C Model</label>
                <Select className='col-12' />
            </div>
            <div className='col-12'>
                <h1>Hello There</h1>
            </div>
        </Modal>
    )
}
