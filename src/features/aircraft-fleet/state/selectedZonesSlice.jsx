import { createSlice } from '@reduxjs/toolkit';
const selectedZonesSlice = createSlice({
    name: 'selectedZones',
    initialState: { value: [] },
    reducers: {
        setAllZones: (state, action) => { state.value = [...action.payload] },

        addZone: (state, action) => {
            state.value.push(action.payload); // payload as {zone_id,zone_name}
        },

        removeZoneByZoneId: (state, action) => {
            let zone_index = state.value.findIndex((el) => { return el.zone_id == action.payload });
            zone_index != -1 && state.value.splice(zone_index, 1);
        },

        resetZones: (state) => { state.value = [] },
    },
});

export const { setAllZones, addZone, removeZoneByZoneId, resetZones } = selectedZonesSlice.actions;
export default selectedZonesSlice.reducer;