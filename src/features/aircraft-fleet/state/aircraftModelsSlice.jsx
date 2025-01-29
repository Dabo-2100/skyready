import { createSlice } from '@reduxjs/toolkit';
const aircraftModelsSlice = createSlice({
    name: 'aircraftModels',
    initialState: { value: [] },
    reducers: {
        setAircraftModels: (state, action) => { state.value = [...action.payload] },
        resetAircraftModels: (state) => { state.value = [] },
    },
});
export const { setAircraftModels, resetAircraftModels } = aircraftModelsSlice.actions;
export default aircraftModelsSlice.reducer;