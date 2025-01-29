import { createSlice } from '@reduxjs/toolkit';
const projectTaskStatusSlice = createSlice({
    name: 'projectTaskStatus',
    initialState: { value: [] },
    reducers: {
        setTaskStatus: (state, action) => { state.value = [...action.payload] },
        resetTaskStatus: (state) => { state.value = [] },
    },
});

export const { setTaskStatus, resetTaskStatus } = projectTaskStatusSlice.actions;
export default projectTaskStatusSlice.reducer;