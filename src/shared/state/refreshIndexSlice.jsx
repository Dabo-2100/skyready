import { createSlice } from '@reduxjs/toolkit';

const refreshIndexSlice = createSlice({
    name: 'refreshIndex',
    initialState: { value: 0 },
    reducers: {
        refresh: (state) => { state.value++ },
    },
});

export const { refresh } = refreshIndexSlice.actions;
export default refreshIndexSlice.reducer;