import { useEffect, useRef, useState } from "react"
import useUsers from "../hooks/useUsers";
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";

export default function NewUser() {
    const { getSystemDefaults, toggleRoleFromArray, registerNewUser } = useUsers();
    const [systemFeatures, setSystemFeatures] = useState([]);
    const [systemRoles, setSystemRoles] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const formInputs = useRef([]);

    useEffect(() => {
        getSystemDefaults().then((res) => { setSystemFeatures(res['app_apps']); setSystemRoles(res['app_roles']); setSpecialties(res['app_specialties']) })
    }, [])

    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                <h1 className="fs-5">Add New user</h1>
                <button className="saveButton" onClick={() => registerNewUser(formInputs, selectedRoles)}>
                    <div className="svg-wrapper-1"><div className="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path></svg></div></div>
                    <span>Save</span>
                </button>
            </header>

            <main className="col-12 d-flex flex-wrap justify-content-center gap-2">
                <div className="col-12 d-flex flex-wrap flex-md-nowrap justify-content-between gap-3 gap-md-0">
                    <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                        <label className="col-12">Email</label>
                        <input ref={el => { formInputs.current[0] = el }} type="email" className="form-control" />
                    </div>
                    <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                        <label className="col-12">Name</label>
                        <input ref={el => { formInputs.current[1] = el }} type="text" className="form-control" />
                    </div>
                </div>

                <div className="col-12 d-flex flex-wrap flex-md-nowrap align-itmes-end justify-content-between gap-3 gap-md-0">
                    <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                        <label className="col-12">Speciality</label>
                        <select ref={el => { formInputs.current[2] = el }} className="form-select" defaultValue={-1}>
                            <option value={-1} hidden>Select Speciality</option>
                            {
                                specialties.map((el) => {
                                    return <option key={el.specialty_id} value={el.specialty_id}>{el.specialty_name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-12 col-md-5 d-flex gap-2 align-items-center">
                        <label>Is Super ? </label>
                        <input ref={el => { formInputs.current[3] = el }} type="checkbox" />
                    </div>

                </div>
                <hr className="col-12" />
                <div className="col-12 d-flex flex-wrap">
                    <h6 className="col-12">User Roles</h6>
                    <table className="table table-bordered text-center">
                        <thead>
                            <tr>
                                <th>-</th>
                                <th>App Name</th>
                                <th>User Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                systemFeatures.map((el, index) => {
                                    return (
                                        <tr key={el.app_id}>
                                            <td>{index + 1}</td>
                                            <td>{el.app_name}</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    defaultValue={-1}
                                                    onChange={(event) => { toggleRoleFromArray(selectedRoles, el.app_id, event.target.value).then(setSelectedRoles) }}
                                                >
                                                    <option value="-1">No role</option>
                                                    {
                                                        systemRoles.map((role) => {
                                                            return (
                                                                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </main>
        </Modal>

    )
}