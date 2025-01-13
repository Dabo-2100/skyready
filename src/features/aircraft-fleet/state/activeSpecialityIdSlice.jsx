import { createSlice } from '@reduxjs/toolkit';
const activeSpecialityIdSlice = createSlice({
    name: 'activeSpecialityId',
    initialState: { value: 0 },
    reducers: {
        setActiveId: (state, action) => { state.value = action.payload },
        resetActiveId: (state) => { state.value = 0 },
    },
});
export const { setActiveId, resetActiveId } = activeSpecialityIdSlice.actions;
export default activeSpecialityIdSlice.reducer;