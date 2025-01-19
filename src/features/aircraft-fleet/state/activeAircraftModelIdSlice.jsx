import { createSlice } from '@reduxjs/toolkit';
const activeAircraftModelIdSlice = createSlice({
    name: 'activeAircraftModelId',
    initialState: { value: 0 },
    reducers: {
        setActiveId: (state, action) => { state.value = action.payload },
        resetActiveId: (state) => { state.value = 0 },
    },
});

export const { setActiveId, resetActiveId } = activeAircraftModelIdSlice.actions;
export default activeAircraftModelIdSlice.reducer;