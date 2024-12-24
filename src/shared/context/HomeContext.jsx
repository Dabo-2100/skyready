import PropTypes from "prop-types";
import { createContext, useState } from "react";

const HomeContext = createContext();
const HomeProvider = ({ children }) => {
    const [appIndex, setAppIndex] = useState(0);
    const [refreshIndex, setRefreshIndex] = useState(0);
    const [menu, setMenu] = useState({ index: false, posX: 0, posY: 0 })
    const [modalIndex, setModal] = useState(0);
    const [modal2Index, setModal2] = useState(0);
    const [modal3Index, setModal3] = useState(0);
    const [modal4Index, setModal4] = useState(0);

    const openModal = (modalNo) => setModal(modalNo);
    const openModal2 = (modalNo) => setModal2(modalNo);
    const openModal3 = (modalNo) => setModal3(modalNo);
    const openModal4 = (modalNo) => setModal4(modalNo);
    const closeModal = () => {
        if (modal4Index != 0) { setModal4(0) }
        else if (modal3Index != 0) { setModal3(0) }
        else if (modal2Index != 0) { setModal2(0) }
        else { setModal(0) }
        refresh();
    }
    const refresh = () => setRefreshIndex(prev => prev + 1);

    return (
        <HomeContext.Provider value={{
            appIndex, setAppIndex,
            modalIndex, openModal,
            modal2Index, openModal2,
            modal3Index, openModal3,
            modal4Index, openModal4, closeModal,
            refresh, refreshIndex,
            menu, setMenu,
        }}>
            {children}
        </HomeContext.Provider>
    );
};

HomeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { HomeContext, HomeProvider };
