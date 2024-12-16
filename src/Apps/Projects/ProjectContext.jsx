// ThemeContext.js
import { createContext, useState } from "react";

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
    // Tab Index State
    const [tabIndex, setTabIndex] = useState(0);
    // Project Tab Index State
    const [projectTabIndex, setProjectTabIndex] = useState(0);
    // Global States
    const [openedProject, setOpenedProject] = useState(0);

    const [tasksInZones, setTasksInZones] = useState([]);

    const [taskFilter, setTaskFilter] = useState({
        tableViewIndex: false,
        tableView: {
            progress: true,
            status: true,
            duration: true,
            startDate: false,
            dueDate: false,
            taskType: true,
            speciality: true,
            task_tags: true,
        },

        openTableFilter: function () {
            let oFilter = { ...this };
            oFilter.tableViewIndex = true;
            setTaskFilter(oFilter)
        },

        closeTableFilter: function () {
            let oFilter = { ...this };
            oFilter.tableViewIndex = false;
            setTaskFilter(oFilter)
        },

        filters: {},
        putSpecialty: function (specialty_id) {
            let oFilter = { ...this };
            oFilter.filters['wpt.specialty_id'] = specialty_id;
            setTaskFilter(oFilter);
        },
        putStatus: function (status_id) {
            let oFilter = { ...this };
            oFilter.filters['pt.status_id'] = status_id;
            setTaskFilter(oFilter);
        },
        clearFilters: function () {
            let oFilter = { ...this };
            oFilter.filters = {}
            setTaskFilter(oFilter);
        }
    });

    const clearFilters = () => {
        let oFilter = { ...taskFilter };
        oFilter.filters = {}
        setTaskFilter(oFilter);
    }

    const [multiSelect, setMultiSelect] = useState({
        index: false,
        ids: [],
        toggleTask: function (task_obj) {
            let x = { ...this }
            let index = x.ids.findIndex((el) => el.log_id == task_obj.log_id);
            index == -1 ? x.ids.push(task_obj) : x.ids.splice(index, 1);
            setMultiSelect(x);
        },
        open: function () {
            let x = { ...this }
            x.ids = [];
            x.index == false ? x.index = true : null;
            setMultiSelect(x);
        },
        close: function () {
            let x = { ...this }
            x.ids = [];
            x.index == true ? x.index = false : null;
            setMultiSelect(x);
        },
        unselectAll: function () {
            let x = { ...this };
            x.ids = [];
            setMultiSelect(x);
        },
    })

    return (
        <ProjectsContext.Provider value={{
            tabIndex, setTabIndex,
            projectTabIndex, setProjectTabIndex,
            openedProject, setOpenedProject,
            taskFilter, setTaskFilter, clearFilters,
            multiSelect, setMultiSelect,
            tasksInZones, setTasksInZones,
        }}>
            {children}
        </ProjectsContext.Provider>
    );
};

export { ProjectsContext, ProjectsProvider };