import { createSlice } from '@reduxjs/toolkit';
const selectedDesignatorsSlice = createSlice({
    name: 'selectedDesignators',
    initialState: { value: [] },
    reducers: {
        setAllDesignators: (state, action) => { state.value = [...action.payload] },

        addDesignator: (state, action) => {
            state.value.push(action.payload); // payload as Designator_id
        },
        removeDesignator: (state, action) => {
            let Designator_index = state.value.findIndex(el => el.designator_id == action.payload);
            Designator_index != -1 && state.value.splice(Designator_index, 1);
        },

        resetDesignators: (state) => { state.value = [] },
    },
});
export const { setAllDesignators, addDesignator, removeDesignator, resetDesignators } = selectedDesignatorsSlice.actions;
export default selectedDesignatorsSlice.reducer;