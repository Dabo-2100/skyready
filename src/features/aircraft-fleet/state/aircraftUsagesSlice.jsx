import { createSlice } from '@reduxjs/toolkit';
const aircraftUsagesSlice = createSlice({
    name: 'aircraftUsages',
    initialState: { value: [] },
    reducers: {
        setAircraftUsages: (state, action) => { state.value = [...action.payload] },
        resetUsages: (state) => { state.value = [] },
    },
});

export const { setAircraftUsages, resetUsages } = aircraftUsagesSlice.actions;
export default aircraftUsagesSlice.reducer;