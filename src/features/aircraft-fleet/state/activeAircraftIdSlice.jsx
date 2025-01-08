import { createSlice } from '@reduxjs/toolkit';
const activeAircraftIdSlice = createSlice({
    name: 'activeAircraftId',
    initialState: { value: 0 },
    reducers: {
        setActiveId: (state, action) => { state.value = action.payload },
        resetActiveId: (state) => { state.value = 0 },
    },
});

export const { setActiveId, resetActiveId } = activeAircraftIdSlice.actions;
export default activeAircraftIdSlice.reducer;