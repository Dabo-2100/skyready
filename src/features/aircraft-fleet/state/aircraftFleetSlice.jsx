import { createSlice } from '@reduxjs/toolkit';
const aircraftFleetSlice = createSlice({
    name: 'aircraftFleet',
    initialState: { value: [] },
    reducers: {
        setAircraftFleet: (state, action) => { state.value = [...action.payload] },
        resetAircraftFleet: (state) => { state.value = [] },
    },
});
export const { setAircraftFleet, resetAircraftFleet } = aircraftFleetSlice.actions;
export default aircraftFleetSlice.reducer;