import { createSlice } from '@reduxjs/toolkit';
const aircraftStatusSlice = createSlice({
    name: 'aircraftStatus',
    initialState: { value: [] },
    reducers: {
        setAircraftStatus: (state, action) => { state.value = [...action.payload] },
        resetStatus: (state) => { state.value = [] },
    },
});

export const { setAircraftStatus, resetStatus } = aircraftStatusSlice.actions;
export default aircraftStatusSlice.reducer;