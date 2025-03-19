import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { UsersRepo } from "../../../../users/data/repositories/UsersRepo";
import { serverUrl, useOperators, useToken } from "../../../../../store-zustand";
import useProjects from "../../hooks/useProjects";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { refresh } from "../../../../../shared/state/refreshIndexSlice";

export default function Operators() {
    const dispatch = useDispatch();
    const nameInput = useRef();
    const { token } = useToken();
    const { closeModal, active_task_id } = useOperators();
    const { updateTaskOperators, getTaskOperators } = useProjects();
    const [newIndex, setNewIndex] = useState(false);
    const [users, setUsers] = useState([]);
    const [view, setView] = useState([]);
    const [selectedOperators, setSelectedOperatros] = useState([]);

    const toggleUser = (id) => {
        let findIndex = selectedOperators.findIndex(el => el == id);

        if (findIndex == -1) {
            setSelectedOperatros([...selectedOperators, id]);
        } else {
            let copy = [...selectedOperators];
            copy.splice(findIndex, 1);
            setSelectedOperatros(copy);
        }
    }

    const handleSearch = () => {
        let val = event.target.value.toLowerCase();
        setView(users.filter((el) => el.user_name.toLowerCase().includes(val)))
    }

    const saveChanges = () => {
        updateTaskOperators(active_task_id, selectedOperators).then(() => {
            Swal.fire({
                icon: "success",
                title: "Operators Updated Successfully",
                timer: 1500
            }).then(() => {
                closeModal();
                dispatch(refresh());
            })
        })
    }

    const saveNewUser = () => {
        let data = {
            user_email: nameInput.current.value.replaceAll(" ", "") + "@operators.skyready",
            user_name: nameInput.current.value,
            specialty_id: 1,
            is_super: 0,
            user_roles: []
        };
        UsersRepo.register_new_user(serverUrl, token, data).then((res) => {
            Swal.fire({
                icon: res == true ? "success" : "error",
                text: res == true ? "User added successfully !" : res == undefined ? "Connection Problem" : res,
                timer: 2500,
            }).then(() => {
                res == true && closeModal();
            })
        })
    }
    useEffect(() => {
        getTaskOperators(active_task_id).then((res) => {
            setSelectedOperatros(res.map((op) => (op.user_id)));
            UsersRepo.all_users(serverUrl, token).then((res) => {
                setUsers(res);
                setView(res);
            });
        });
        // eslint-disable-next-line
    }, []);

    return (
        <div className={styles.layout} onClick={closeModal}>
            <div onClick={e => e.stopPropagation()} className="bg-white rounded shadow border p-3 col-10 col-md-4 text-dark h-100 overflow-auto animate__animated animate__fadeInUp">
                <div className="col-12 d-flex align-items-center justify-content-between pb-3">
                    <h6 className="mb-0">Task Operators</h6>
                    <button className="btn addBtn" onClick={saveChanges}>Save Changes</button>
                </div>
                {
                    !newIndex &&
                    <div className="d-flex align-items-center justify-content-between">
                        <input className="form-control rounded-bottom-0 mx-2" placeholder="Search Operators" onChange={handleSearch} />
                        <button className="btn addBtn col-2 rounded-bottom-0" onClick={() => setNewIndex(true)}>Add</button>
                    </div>
                }

                {
                    newIndex && <div className="col-12 d-flex flex-column gap-3 mb-3 animate__animated animate__fadeIn border p-3">
                        <h6 className="m-0">New Operator</h6>
                        <input ref={nameInput} className="form-control " placeholder="Enter Operator Name" type="text" />
                        <div className="d-flex col-12 align-items-center justify-content-between">
                            <button className="btn btn-danger col-5" onClick={() => setNewIndex(false)}>Cancel</button>
                            <button className="btn addBtn col-5" onClick={saveNewUser}>Save Operator</button>
                        </div>
                    </div>
                }

                <table className="table table-dark table-bordered text-center">
                    <thead>
                        <tr>
                            <th className="col-10">Operators</th>
                            <th className="col-2">-</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            view.map((el) => (
                                <tr key={el.user_id}>
                                    <td>{el.user_name}</td>
                                    <td>
                                        <div className="form-check form-switch col-12 d-flex justify-content-center">
                                            <input defaultChecked={selectedOperators.includes(el.user_id)} onChange={() => toggleUser(el.user_id)} className="form-check-input" type="checkbox" role="switch" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}