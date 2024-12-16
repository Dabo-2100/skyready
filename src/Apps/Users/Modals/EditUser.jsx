import { useContext, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import axios from "axios";
import Swal from "sweetalert2";
import { $Server, $Token, $SwalDark } from "@/store";
import { HomeContext } from "@/Pages/HomePage/HomeContext";
import { getAppRoles, getUserDetails } from "../controller";
import { formCheck } from "@/customHooks";
import { UserContext } from "../UserContext";
export default function EditUser() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { closeModal } = useContext(HomeContext);
    const { userToEdit } = useContext(UserContext);

    const [userInfo, setUserInfo] = useState({});
    const [roles, setRoles] = useState([]);
    const [apps, setApps] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const emailInput = useRef();
    const nameInput = useRef();
    const specialty_id = useRef();
    const is_super = useRef();

    const selectsRef = useRef([]);

    const toggleRole = (app_id, role_id) => {
        let roleIndex = selectedRoles.findIndex(el => el.app_id == app_id);
        let obj = {
            app_id: app_id,
            role_id: role_id
        }
        if (roleIndex == -1) {
            setSelectedRoles([...selectedRoles, obj]);
        }
        else {
            if (role_id == -1) {
                selectedRoles.splice(roleIndex, 1);
            }
            else {
                let oRoles = [...selectedRoles];
                oRoles[roleIndex] = obj;
                setSelectedRoles(oRoles);

            }
        }
    }

    const handleSubmit = () => {
        let formErrors = formCheck([
            { value: nameInput.current.value, options: { required: true } },
        ]);
        if (formErrors == 0) {
            let data = {
                user_id: userToEdit,
                user_name: nameInput.current.value,
                specialty_id: specialty_id.current.value,
                is_super: is_super.current.checked,
                user_roles: selectedRoles
            }
            axios.post(`${serverUrl}/php/index.php/api/users/update`, data, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
                if (res.data.err) {
                    Swal.fire({
                        icon: "error",
                        text: res.data.msg.errorInfo[2],
                        timer: 1500,
                    });
                } else {
                    Swal.fire({
                        icon: "success",
                        text: "User Updated successfully !",
                        timer: 1500,
                    }).then(() => {
                        closeModal();
                    })
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                text: "Please fill all user data first",
                timer: 1500,
            });
        }
    }

    useEffect(() => {
        getAppRoles(serverUrl, token).then((res) => {
            setApps(res['app_apps']);
            setRoles(res['app_roles']);
            setSpecialties(res['app_specialties']);
        })
    }, []);

    useEffect(() => {
        if (apps.length > 0) {
            getUserDetails(serverUrl, token, userToEdit).then((res) => {
                setUserInfo(res[0]);
                specialty_id.current.value = res[0].specialty_id;
                let roles = res[0].user_roles;
                let selected = [];
                roles.forEach(role => {
                    let appIndex = apps.findIndex(el => el.app_id == role.app_id);
                    selectsRef.current[appIndex].value = role.role_id;
                    let obj = {
                        app_id: role.app_id,
                        role_id: role.role_id
                    }
                    selected.push(obj);
                });
                setSelectedRoles(selected);
            });
        }
    }, [apps]);

    return (
        <div className="modal">
            <div className={`animate__animated animate__fadeIn content`} onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button className="backButton" onClick={() => { closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>

                <header className="col-12 p-0 pb-2 px-3 d-flex align-items-center justify-content-between">
                    <h1 className="fs-5">Add New user</h1>
                    <button className="saveButton" onClick={handleSubmit}>
                        <div className="svg-wrapper-1"><div className="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path></svg></div></div>
                        <span>Save</span>
                    </button>
                </header>

                <main className="col-12 d-flex flex-wrap justify-content-center gap-2">
                    <div className="col-12 d-flex flex-wrap flex-md-nowrap justify-content-between gap-3 gap-md-0">
                        <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                            <label className="col-12">Email</label>
                            <input defaultValue={userInfo.user_email} disabled type="email" className="form-control" />
                        </div>
                        <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                            <label className="col-12">Name</label>
                            <input defaultValue={userInfo.user_name} ref={nameInput} type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="col-12 d-flex flex-wrap flex-md-nowrap align-itmes-end justify-content-between gap-3 gap-md-0">
                        <div className="col-12 col-md-5 d-flex flex-wrap gap-1">
                            <label className="col-12">Speciality</label>
                            <select ref={specialty_id} className="form-select" defaultValue={userInfo.specialty_id}>
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
                            <input defaultChecked={userInfo.is_super} ref={is_super} type="checkbox" />
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
                                    apps.map((el, index) => {
                                        return (
                                            <tr key={el.app_id}>
                                                <td>{index + 1}</td>
                                                <td>{el.app_name}</td>
                                                <td>
                                                    <select ref={(el) => (selectsRef.current[index] = el)} className="form-select" defaultValue={-1} onChange={(event) => { toggleRole(el.app_id, event.target.value) }}>
                                                        <option value="-1">No role</option>
                                                        {
                                                            roles.map((role) => {
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

            </div>
        </div>
    )
}