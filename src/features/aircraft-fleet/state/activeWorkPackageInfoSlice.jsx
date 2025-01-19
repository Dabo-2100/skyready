import { createSlice } from '@reduxjs/toolkit';
const activeWorkPackageInfoSlice = createSlice({
    name: 'activeWorkPackageInfo',
    initialState: { value: {} },
    reducers: {
        setPackageInfo: (state, action) => { state.value = { ...action.payload } },
        resetPackageInfo: (state) => { state.value = {} },
    },
});

export const { setPackageInfo, resetPackageInfo } = activeWorkPackageInfoSlice.actions;
export default activeWorkPackageInfoSlice.reducer;