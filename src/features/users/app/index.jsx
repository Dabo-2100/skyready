import "./index.css";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { HomeContext } from "../../../Pages/HomePage/HomeContext.jsx";
import { UserContext } from "../UserContext";
import useUsers from "../ui/hooks/useUsers";

export default function UsersApp() {
    const { getUsers } = useUsers();
    const { setUserToEdit } = useContext(UserContext);
    const { openModal, refreshIndex } = useContext(HomeContext)
    const [users, setUsers] = useState([]);
    useEffect(() => { getUsers().then(setUsers) }, [refreshIndex]);

    return (
        <div className="tabApp d-flex flex-column p-3" id="UsersApp">
            <div className="col-12 d-flex flex-column content p-3 rounded-4 gap-3">
                <div className="col-12 d-flex align-items-center justify-content-between ">
                    <h5 className="m-0">Users List</h5>
                    <button className="btn addBtn" onClick={() => { openModal(7000) }}>
                        <FontAwesomeIcon icon={faPlus} /> Add User
                    </button>
                </div>
                <div className="col-12 d-flex align-items-start overflow-auto flex-grow-1">
                    <table className="table table-dark table-hover table-bordered text-center m-0">
                        <thead>
                            <tr>
                                <th>-</th>
                                <th>User Name</th>
                                <th>User Roles</th>
                                <th>User Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((el, index) => {
                                    return (
                                        <tr key={el.user_id} onClick={() => { setUserToEdit(el.user_id); openModal(7001) }}>
                                            <td>{index + 1}</td>
                                            <td>{el.user_name}</td>
                                            <td>{el.user_roles}</td>
                                            <td>{el.is_active}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
