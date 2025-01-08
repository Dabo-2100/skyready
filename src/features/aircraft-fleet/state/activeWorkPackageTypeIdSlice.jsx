import { createSlice } from '@reduxjs/toolkit';
const activeWorkPackageTypeIdSlice = createSlice({
    name: 'activeWorkPackageTypeId',
    initialState: { value: 0 },
    reducers: {
        setActiveType: (state, action) => { state.value = action.payload },
        resetActiveType: (state) => { state.value = 0 },
    },
});
export const { setActiveType, resetActiveType } = activeWorkPackageTypeIdSlice.actions;
export default activeWorkPackageTypeIdSlice.reducer;