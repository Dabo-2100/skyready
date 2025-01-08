import { createSlice } from '@reduxjs/toolkit';
const aircraftFleetTabIndexSlice = createSlice({
    name: 'aircraftFleetTabIndex',
    initialState: { value: 0 },
    reducers: {
        setTabIndex: (state, action) => { state.value = action.payload },
        resetTabIndex: (state) => { state.value = 0 },
    },
});
export const { setTabIndex, resetTabIndex } = aircraftFleetTabIndexSlice.actions;
export default aircraftFleetTabIndexSlice.reducer;