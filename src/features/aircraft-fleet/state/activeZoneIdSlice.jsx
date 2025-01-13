import { createSlice } from '@reduxjs/toolkit';
const activeZoneIdSlice = createSlice({
    name: 'activeZoneId',
    initialState: { value: { zone_id: 0, zone_name: "" } },
    reducers: {
        setActiveId: (state, action) => { state.value = { ...action.payload } },
        resetActiveId: (state) => { state.value = { zone_id: 0, zone_name: "" } },
    },
});
export const { setActiveId, resetActiveId } = activeZoneIdSlice.actions;
export default activeZoneIdSlice.reducer;

// Solid Princebles / Quality Attributes / maintability / design stamina hyponsis 