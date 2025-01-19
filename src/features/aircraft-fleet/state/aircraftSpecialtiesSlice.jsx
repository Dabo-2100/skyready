import { createSlice } from '@reduxjs/toolkit';
const workPackageTypesSlice = createSlice({
    name: 'aircraftSpecialties',
    initialState: { value: [] },
    reducers: {
        setSpecialties: (state, action) => { state.value = [...action.payload] },
        resetSpecialties: (state) => { state.value = [] },
    },
});

export const { setSpecialties, resetSpecialties } = workPackageTypesSlice.actions;
export default workPackageTypesSlice.reducer;