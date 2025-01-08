import { createSlice } from '@reduxjs/toolkit';
const activeWorkPackageFolderIdSlice = createSlice({
    name: 'activeWorkPackageFolderId',
    initialState: { value: 0 },
    reducers: {
        setActiveId: (state, action) => { state.value = action.payload },
        resetActiveId: (state) => { state.value = 0 },
    },
});
export const { setActiveId, resetActiveId } = activeWorkPackageFolderIdSlice.actions;
export default activeWorkPackageFolderIdSlice.reducer;