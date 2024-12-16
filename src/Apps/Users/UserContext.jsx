import { createContext, useState } from "react";
const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [userToEdit, setUserToEdit] = useState(0);
    const [Menu, setMenu] = useState({
        index: false,
        xPos: 0,
        yPos: 0,
        openMenu: function (x, y) {
            let oState = { ...Menu }
            oState.index = true;
            oState.xPos = x;
            oState.yPos = y;
            setMenu(oState);
        },
        closeMenu: function () {
            let oState = { ...Menu }
            oState.index = false;
            setMenu(oState);
        }
    });

    return (
        <UserContext.Provider value={{ userToEdit, setUserToEdit, Menu }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }