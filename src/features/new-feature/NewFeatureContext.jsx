import PropTypes from "prop-types";
import { createContext, useState } from "react";

const NewFeatureContext = createContext();
const NewFeatureProvider = ({ children }) => {
    const [appIndex, setAppIndex] = useState(0);
    return (
        <NewFeatureContext.Provider value={{
            appIndex, setAppIndex,
        }}>
            {children}
        </NewFeatureContext.Provider>
    );
};

NewFeatureProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { NewFeatureContext, NewFeatureProvider };
