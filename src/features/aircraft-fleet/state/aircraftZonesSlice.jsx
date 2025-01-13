import { createSlice } from '@reduxjs/toolkit';
const aircraftZonesSlice = createSlice({
    name: 'aircraftZones',
    initialState: { value: [] },
    reducers: {
        setAircraftZones: (state, action) => { state.value = [...action.payload] },
        resetAircraftZones: (state) => { state.value = [] },
    },
});
export const { setAircraftZones, resetAircraftZones } = aircraftZonesSlice.actions;
export default aircraftZonesSlice.reducer;