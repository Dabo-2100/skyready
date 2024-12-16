import "./index.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { useContext, useEffect, useState } from "react"
import { HomeContext } from "@/Pages/HomePage/HomeContext"
import { getAllUsers } from "./controller"
import { useRecoilState } from "recoil"
import { $Server, $SwalDark, $Token } from "@/store"
import { UserContext } from "./UserContext"
import ContextMenu from "./Modals/ContextMenu.jsx"
export default function UsersApp() {
    // Context
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { refreshIndex, openModal } = useContext(HomeContext)
    const { setUserToEdit, Menu } = useContext(UserContext);
    // States
    const [users, setUsers] = useState([]);
    // Effect
    const handleRightClick = (event) => {
        event.preventDefault();
        Menu.openMenu(event.clientX, event.clientY);
    }
    // Refresh
    useEffect(() => {
        getAllUsers(serverUrl, token).then((res) => { setUsers(res) }).catch((err) => { })
    }, [refreshIndex])
    return (
        <div className="tabApp d-flex flex-column p-3" id="UsersApp">
            {
                Menu.index && <ContextMenu />
            }
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
                                        <tr onContextMenu={handleRightClick} key={el.user_id} onClick={() => { setUserToEdit(el.user_id); openModal(7001) }}>
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
