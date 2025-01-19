import { createSlice } from '@reduxjs/toolkit';
const workPackagesSlice = createSlice({
    name: 'workPackages',
    initialState: { value: [] },
    reducers: {
        setWorkPackages: (state, action) => { state.value = action.payload },
        resetWorkPackages: (state) => { state.value = [] },
    },
});

export const { setWorkPackages, resetWorkPackages } = workPackagesSlice.actions;
export default workPackagesSlice.reducer;