// ThemeContext.js
import PropTypes from "prop-types";
import { createContext, useState } from "react";
const HomeContext = createContext();

const HomeProvider = ({ children }) => {
  // Modal Layer 1 Index State
  const [modalIndex, setModal] = useState(0);
  const openModal = (modalNo) => setModal(modalNo);
  // Modal Layer 2 Index State
  const [modal2Index, setModal2] = useState(0);
  const openModal2 = (modalNo) => setModal2(modalNo);
  // Modal Layer 3 Index State
  const [modal3Index, setModal3] = useState(0);
  const openModal3 = (modalNo) => setModal3(modalNo);
  // Modal Layer 4 Index State
  const [modal4Index, setModal4] = useState(0);
  const openModal4 = (modalNo) => setModal4(modalNo);
  // Close Current Modal
  const closeModal = () => {
    if (modal4Index != 0) { setModal4(0) }
    else if (modal3Index != 0) { setModal3(0) }
    else if (modal2Index != 0) { setModal2(0) }
    else { setModal(0) }
    refresh();
  }
  // Refresh Modal States
  const [refreshIndex, setRefreshIndex] = useState(0);
  const refresh = () => setRefreshIndex((prev) => (prev + 1));
  // const task right menu
  const [menu, setMenu] = useState({ index: false, posX: 0, posY: 0 })

  return (
    <HomeContext.Provider value={{
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
