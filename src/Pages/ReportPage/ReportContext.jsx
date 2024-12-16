import { createContext, useState } from "react";
const ReportContext = createContext();
const ReportProvider = ({ children }) => {
    const [reportIndex, setReportIndex] = useState(1);
    const [activeProject, setActiveProject] = useState(0);
    const [modalIndex, setModalIndex] = useState(0);
    const [activeWP, setActiveWP] = useState(0);
    return (
        <ReportContext.Provider value={{
            reportIndex, setReportIndex,
            activeProject, setActiveProject,
            modalIndex, setModalIndex,
            activeWP, setActiveWP,
        }}>
            {children}
        </ReportContext.Provider>
    )
};

export { ReportContext, ReportProvider };