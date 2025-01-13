import { createSlice } from '@reduxjs/toolkit';
const activeAppIndexSlice = createSlice({
    name: 'activeAppIndex',
    initialState: { value: 0 },
    reducers: {
        setActiveIndex: (state, action) => { state.value = action.payload },
        resetActiveIndex: (state) => { state.value = 0 },
    },
});
export const { setActiveIndex, resetActiveIndex } = activeAppIndexSlice.actions;
export default activeAppIndexSlice.reducer;