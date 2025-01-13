import { createSlice } from '@reduxjs/toolkit';
const activeWorkPackageTaskSlice = createSlice({
    name: 'activeWorkPackageTask',
    initialState: { value: {} },
    reducers: {
        setActiveTask: (state, action) => { state.value = { ...action.payload } },
        resetActiveTask: (state) => { state.value = {} },
    },
});
export const { setActiveTask, resetActiveTask } = activeWorkPackageTaskSlice.actions;
export default activeWorkPackageTaskSlice.reducer;