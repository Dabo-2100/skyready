import { createSlice } from '@reduxjs/toolkit';
const activeProjectSlice = createSlice({
    name: 'activeProject',
    initialState: { id: 0, info: {}, activePackages: [], availablePackages: [] },
    reducers: {
        setActiveId: (state, action) => { state.id = action.payload },
        setProjectInfo: (state, action) => { state.info = { ...action.payload } },
        setActivePackages: (state, action) => { state.activePackages = [...action.payload] },
        setAvailablePackages: (state, action) => { state.availablePackages = [...action.payload] },
        resetActiveProject: (state) => { state.id = 0; state.info = {}, state.activePackages = [], state.availablePackages = [] },
    },
});

export const { setActiveId, resetActiveProject, setProjectInfo, setActivePackages, setAvailablePackages } = activeProjectSlice.actions;
export default activeProjectSlice.reducer;