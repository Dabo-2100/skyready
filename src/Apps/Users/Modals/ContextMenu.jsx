import { useContext } from "react"
import { UserContext } from "../UserContext"
export default function ContextMenu() {
    const { Menu } = useContext(UserContext);
    return (
        <div id="userContextMenu" onContextMenu={(event) => { event.stopPropagation(); event.preventDefault(); Menu.closeMenu() }} className="col-12" style={{ height: "100vh", position: "fixed", top: 0, left: 0 }} onClick={() => { Menu.closeMenu() }}>
            <div className="bg-white text-dark rounded-3 p-3 d-flex flex-wrap" style={{ position: "fixed", top: Menu.yPos, left: Menu.xPos, width: "200px" }}>
                <p className="col-12">Reset Password</p>
                <p className="col-12">Delete User</p>
                <p className="col-12">Reset Password</p>
            </div>
        </div>
    )
}
