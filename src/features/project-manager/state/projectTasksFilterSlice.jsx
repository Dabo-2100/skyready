import { createSlice } from '@reduxjs/toolkit';
const projectTasksFilterSlice = createSlice({
    name: 'projectTasksFilter',
    initialState: {
        workPackageNameFilter: "",
        tableView: [],
        selectedSpecialties: [],
        selectedStatus: [],
        selectedZones: [],
    },

    reducers: {
        searchByName: (state, action) => {
            state.workPackageNameFilter = action.payload;
        },

        setTableView: (state, action) => { state.tableView = [...action.payload] },

        toggleSpeciality: (state, action) => {
            let specialty_id = action.payload.specialty_id;
            let index = state.selectedSpecialties.findIndex(el => { return el.specialty_id == specialty_id });
            index == -1 ? state.selectedSpecialties.push({ ...action.payload }) : state.selectedSpecialties.splice(index, 1);
        },

        toggleStatus: (state, action) => {
            let status_id = action.payload.status_id;
            let index = state.selectedStatus.findIndex(el => { return el.status_id == status_id });
            index == -1 ? state.selectedStatus.push({ ...action.payload }) : state.selectedStatus.splice(index, 1);
        },

        toggleZones: (state, action) => {
            let zone_id = action.payload.zone_id;
            let index = state.selectedZones.findIndex(el => { return el.zone_id == zone_id });
            index == -1 ? state.selectedZones.push({ ...action.payload }) : state.selectedZones.splice(index, 1);
        },

        clearFilters: (state) => {
            state.selectedSpecialties = [];
            state.selectedStatus = [];
            state.selectedZones = [];
        },

        toggleView: (state, action) => {
            let field_id = action.payload.id;
            let index = state.tableView.findIndex(el => { return el.id == field_id });
            state.tableView[index].active = !state.tableView[index].active;
            localStorage.setItem("tableView", JSON.stringify(state.tableView));
        },

        resetTableView: (state) => {
            state.tableView = [
                { id: 1, name: "Task Name", active: true },
                { id: 2, name: "Task Type", active: true },
                { id: 3, name: "Task Description", active: false },
                { id: 4, name: "Task Speciality", active: true },
                { id: 5, name: "Task Progress", active: true },
                { id: 6, name: "Task Status", active: true },
                { id: 7, name: "Task Duration", active: true },
                { id: 8, name: "Start Date", active: false },
                { id: 9, name: "End Date", active: false },
                { id: 10, name: "Actions", active: true },
            ]
        },
    },
});

export const { setTableView, resetTableView, toggleSpeciality, toggleStatus, toggleZones, clearFilters, searchByName, toggleView } = projectTasksFilterSlice.actions;
export default projectTasksFilterSlice.reducer;