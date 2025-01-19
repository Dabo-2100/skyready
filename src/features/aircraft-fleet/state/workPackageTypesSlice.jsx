import { createSlice } from '@reduxjs/toolkit';
const workPackageTypesSlice = createSlice({
    name: 'workPackages',
    initialState: { value: [] },
    reducers: {
        setWorkPackageTypes: (state, action) => { state.value = [...action.payload] },
        resetWorkPackageTypes: (state) => { state.value = [] },
    },
});

export const { setWorkPackageTypes, resetWorkPackageTypes } = workPackageTypesSlice.actions;
export default workPackageTypesSlice.reducer;