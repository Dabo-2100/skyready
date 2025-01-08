import { createSlice } from '@reduxjs/toolkit';
const activeWorkPackageTaskIdSlice = createSlice({
    name: 'activeWorkPackageTaskId',
    initialState: { value: 0 },
    reducers: {
        setActiveId: (state, action) => { state.value = action.payload },
        resetActiveId: (state) => { state.value = 0 },
    },
});
export const { setActiveId, resetActiveId } = activeWorkPackageTaskIdSlice.actions;
export default activeWorkPackageTaskIdSlice.reducer;