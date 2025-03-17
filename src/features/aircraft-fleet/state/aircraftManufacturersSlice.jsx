import { createSlice } from '@reduxjs/toolkit';
const aircraftManufacturersSlice = createSlice({
    name: 'aircraftManufacturers',
    initialState: { value: [] },
    reducers: {
        setAircraftManufacturers: (state, action) => { state.value = [...action.payload] },
        resetManufacturers: (state) => { state.value = [] },
    },
});

export const { setAircraftManufacturers, resetManufacturers } = aircraftManufacturersSlice.actions;
export default aircraftManufacturersSlice.reducer;