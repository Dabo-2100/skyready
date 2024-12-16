import React, { useContext, useEffect, useRef, useState } from 'react'
import Modal from './Modal'
import { HomeContext } from '../../../../Pages/HomePage/HomeContext'
import SaveBtn from '../Components/SaveBtn'
import FormField from '../Components/FormField'
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import useWarehouse from '../Hooks/useWarehouse'
import { useRecoilValue } from 'recoil'
import { $Server, $Token } from '../../../../store'

export default function NewItem() {
    const { openModal3, refreshIndex } = useContext(HomeContext);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);

    useEffect(() => {
        useWarehouse().getAllCats(serverUrl, token).then((res) => {
            let cats = res.data;
            setCats(cats.map((el) => { return { cat_name: el.category_name, cat_id: el.category_id } }))
        });
        useWarehouse().getAllUnits(serverUrl, token).then((res) => {
            setUnits(res.data.map((el) => { return { unit_name: el.unit_name, unit_id: el.unit_id } }))
        });
    }, [refreshIndex]);

    const [cats, setCats] = useState([]);

    const [units, setUnits] = useState([]);

    const inputs = useRef([]);
    const handleSubmit = (event) => {
        event.preventDefault();
        useWarehouse().addNewItem(serverUrl, token, inputs.current).then(() => {
            closeModal()
        });
    }
    return (
        <Modal>
            <div className={"col-12 px-3 d-flex align-items-center justify-content-between"}>
                <h5 className='m-0'>Add new product</h5>
                <SaveBtn label={"Add"} onClick={handleSubmit}></SaveBtn>
            </div>
            <hr className='col-12' />
            <div>
                <form onSubmit={handleSubmit} className='d-flex flex-wrap justify-content-between row-gap-3 px-3'>
                    <FormField>
                        <FormField.Label>Item P/N <span className='text-danger'>*</span></FormField.Label>
                        <FormField.Input ref={(el) => (inputs.current[0] = el)} className="form-control"></FormField.Input>
                    </FormField>
                    <FormField>
                        <FormField.Label>Item Name </FormField.Label>
                        <FormField.Input ref={(el) => (inputs.current[1] = el)} className="form-control"></FormField.Input>
                    </FormField>
                    <FormField>
                        <div className='col-12 d-flex align-items-center justify-content-between'>
                            <label>Items Categories <span className='text-danger'>*</span></label>
                            <FontAwesomeIcon className='addBtn btn' icon={faGear} onClick={() => openModal3(8004)} />
                        </div>
                        <Select
                            className='col-12 form-control'
                            ref={(el) => (inputs.current[2] = el)}
                            options={cats.map((el) => { return { value: el.cat_id, label: el.cat_name } })}
                        />
                    </FormField>
                    <FormField>
                        <div className='col-12 d-flex align-items-center justify-content-between'>
                            <label>Items Unit <span className='text-danger'>*</span></label>
                            <FontAwesomeIcon className='addBtn btn' icon={faGear} onClick={() => openModal3(8005)} />
                        </div>
                        <Select
                            className='col-12 form-control'
                            ref={(el) => (inputs.current[3] = el)}
                            options={units.map((el) => { return { value: el.unit_id, label: el.unit_name } })}
                        />
                    </FormField>
                    <FormField>
                        <FormField.Label>Item S/N</FormField.Label>
                        <FormField.Input ref={(el) => (inputs.current[4] = el)} className="form-control"></FormField.Input>
                    </FormField>

                    <FormField>
                        <FormField.Label>Item NSN</FormField.Label>
                        <FormField.Input ref={(el) => (inputs.current[5] = el)} className="form-control"></FormField.Input>
                    </FormField>

                </form>
            </div>
        </Modal>
    )
}
