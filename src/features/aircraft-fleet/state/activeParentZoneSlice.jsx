import { createSlice } from '@reduxjs/toolkit';
const activeParentZoneSlice = createSlice({
    name: 'activeParentZone',
    initialState: { value: { id: 0, name: "" } },
    reducers: {
        setActiveId: (state, action) => { state.value = { ...action.payload } },
        resetActiveId: (state) => { state.value = { id: 0, name: "" } },
    },
});

export const { setActiveId, resetActiveId } = activeParentZoneSlice.actions;
export default activeParentZoneSlice.reducer;