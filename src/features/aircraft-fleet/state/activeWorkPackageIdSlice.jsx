import { createSlice } from '@reduxjs/toolkit';
const activeWorkPackageIdSlice = createSlice({
    name: 'activeWorkPackageId',
    initialState: { value: 0 },
    reducers: {
        setActiveId: (state, action) => { state.value = action.payload },
        resetActiveId: (state) => { state.value = 0 },
    },
});
export const { setActiveId, resetActiveId } = activeWorkPackageIdSlice.actions;
export default activeWorkPackageIdSlice.reducer;