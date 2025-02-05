import { useEffect, useRef, useState } from "react"
import useUsers from "../hooks/useUsers";
import { useSelector } from "react-redux";
import Modal from "../../../../shared/ui/modals/Modal";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";

export default function EditUser() {
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const { getSystemDefaults, getUserFeatures, toggleRoleFromArray, updateUserFeatuers, activateUser, removeUser } = useUsers();
    const [systemFeatures, setSystemFeatures] = useState([]);
    const [systemRoles, setSystemRoles] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const formInputs = useRef([]);
    const featuerRoleSelects = useRef([]);

    useEffect(() => {
        let featuers = [];
        getSystemDefaults().then((res) => {
            featuers = res['app_apps']; setSystemFeatures(res['app_apps']); setSystemRoles(res['app_roles']); setSpecialties(res['app_specialties'])
        }).then(() => {
            getUserFeatures().then((res) => {
                setUserInfo(res);
                setSelectedRoles(res.user_roles.map((el) => { return { app_id: el.app_id, role_id: el.role_id } }));
                formInputs.current[1].value = res.specialty_id;
                res.user_roles.forEach(role => { featuerRoleSelects.current[featuers.findIndex(el => el.app_id == role.app_id)].value = role.role_id; });
            })
        })
    }, [refreshIndex])

    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                <h1 className="fs-5">Edit user roles</h1>
                <div className="d-flex align-items-center gap-3">
                    {
                        userInfo.is_active ?
                            <button onClick={removeUser} className="btn btn-danger">Remove User</button> :
                            <button onClick={activateUser} className="btn btn-success">Activate User</button>
                    }
                    <SaveBtn onClick={() => updateUserFeatuers(formInputs, selectedRoles)} label="Save" />
                </div>
            </header>

            <main className="col-12 d-flex flex-wrap justify-content-center gap-2">
                <div className="col-12 d-flex flex-wrap flex-md-nowrap justify-content-between gap-3 gap-md-0">
                    <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                        <label className="col-12">Email</label>
                        <input defaultValue={userInfo.user_email} disabled type="email" className="form-control" />
                    </div>
                    <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                        <label className="col-12">Name</label>
                        <input defaultValue={userInfo.user_name} ref={el => { formInputs.current[0] = el }} type="text" className="form-control" />
                    </div>
                </div>

                <div className="col-12 d-flex flex-wrap flex-md-nowrap align-itmes-end justify-content-between gap-3 gap-md-0">
                    <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                        <label className="col-12">Speciality</label>
                        <select ref={el => { formInputs.current[1] = el }} className="form-select" defaultValue={userInfo.specialty_id}>
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
                        <input defaultChecked={userInfo.is_super} ref={el => { formInputs.current[2] = el }} type="checkbox" />
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
                                                <select ref={(el) => (featuerRoleSelects.current[index] = el)} className="form-select" defaultValue={-1} onChange={(event) => { toggleRoleFromArray(selectedRoles, el.app_id, event.target.value).then(setSelectedRoles) }}>
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