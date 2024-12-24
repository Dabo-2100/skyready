import PropTypes from "prop-types";
import { createContext, useState } from "react";

const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [userToEdit, setUserToEdit] = useState(0);
    return (
        <UserContext.Provider value={{
            userToEdit, setUserToEdit,
        }}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { UserContext, UserProvider };
