import { createSlice } from '@reduxjs/toolkit';
const activeAircraftIdSlice = createSlice({
    name: 'activeAircraftId',
    initialState: { value: 0, data: {} },
    reducers: {
        setActiveId: (state, action) => { state.value = action.payload },
        resetActiveId: (state) => { state.value = 0; state.data = {} },
        setAircraftInfo: (state, action) => { state.data = action.payload },
    },
});

export const { setActiveId, resetActiveId, setAircraftInfo } = activeAircraftIdSlice.actions;
export default activeAircraftIdSlice.reducer;