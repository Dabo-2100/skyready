import Modal from "./Modal";
import SaveBtn from "../Components/SaveBtn";
import { useEffect, useRef, useState } from "react";
import FormField from "../Components/FormField";
import Select from 'react-select';
import useNewWarehouse from "../Hooks/useNewWarehouse";
import { useRecoilState } from "recoil";
import { $Server, $Token } from "../../../../store";

export default function NewWarehouse() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [newName, setNewName] = useState();
    const [oUsers, setOUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const adminsRef = useRef();
    const usersRef = useRef();

    useEffect(() => { useNewWarehouse().getUsers(serverUrl, token).then((res) => { setUsers(res); setOUsers(res) }) }, []);
    return (
        <Modal>
            <div className={"col-12"}>
                <div className="col-12 px-3  d-flex align-items-center justify-content-between">
                    <h5 className="p-0 m-0">Add New Warehouse</h5>
                    <SaveBtn onClick={() => useNewWarehouse().handleSubmit(serverUrl, token, { newName, adminsRef, usersRef })} label={"Save"} />
                </div>
            </div >
            <div className="col-12">
                <div className="col-12 d-flex flex-column">
                    <hr className="col-12 " />
                    <div className="col-12 row-gap-3 d-flex flex-wrap justify-content-between px-3">
                        <FormField>
                            <FormField.Label>Warehouse Name</FormField.Label>
                            <FormField.Input className="form-control" type="text" onChange={(event) => { setNewName(event.target.value) }} placeholder='Enter warehouse name' />
                        </FormField>
                        <FormField>
                            <FormField.Label>Select Admins</FormField.Label>
                            <Select className="col-12" ref={adminsRef} options={oUsers} onChange={(options) => { setOUsers(useNewWarehouse().toggleUser(users, options)) }} closeMenuOnSelect={false} isMulti>
                            </Select>
                        </FormField>
                        <FormField>
                            <FormField.Label>Select Users</FormField.Label>
                            <Select ref={usersRef} className="col-12" options={oUsers} onChange={(options) => { setOUsers(useNewWarehouse().toggleUser(users, options)) }} closeMenuOnSelect={false} isMulti></Select>
                        </FormField>
                    </div>
                </div>
            </div>
        </Modal >
    )
}