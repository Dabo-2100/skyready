import { createSlice } from '@reduxjs/toolkit';
const contextMenuSlice = createSlice({
    name: 'contextMenu',
    initialState: { index: false, xPosition: 0, yPosition: 0 },
    reducers: {
        openContextMenu: (state, action) => {
            state.index = true;
            state.xPosition = action.payload.xPosition;
            state.yPosition = action.payload.yPosition;
        },
        closeContextMenu: (state) => {
            state.index = false;
            state.xPosition = 0;
            state.yPosition = 0;
        },
    },
});
export const { openContextMenu, closeContextMenu } = contextMenuSlice.actions;
export default contextMenuSlice.reducer;