import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
    name: "modals",
    initialState: {
        layerOneIndex: 0, layerTwoIndex: 0, layerThreeIndex: 0, layerFourIndex: 0,
    },
    reducers: {
        openModal: (state, action) => {
            state.layerOneIndex = action.payload;
        },

        openModal2: (state, action) => {
            state.layerTwoIndex = action.payload;
        },

        openModal3: (state, action) => {
            state.layerThreeIndex = action.payload;
        },

        openModal4: (state, action) => {
            state.layerFourIndex = action.payload;
        },

        closeModal: (state) => {
            if (state.layerFourIndex != 0) { state.layerFourIndex = 0 }
            else if (state.layerThreeIndex != 0) { state.layerThreeIndex = 0 }
            else if (state.layerTwoIndex != 0) { state.layerTwoIndex = 0 }
            else { state.layerOneIndex = 0 }
        },
    }
})
export const { openModal, openModal2, openModal3, openModal4, closeModal } = modalSlice.actions;
export default modalSlice.reducer;