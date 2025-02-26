import { createSlice } from '@reduxjs/toolkit';
const activeUserSlice = createSlice({
    name: 'activeUser',
    initialState: { value: 0, data: {} },
    reducers: {
        setActiveUserId: (state, action) => { state.value = action.payload },
        resetActiveUser: (state) => { state.value = 0; state.data = {} },
    },
});

export const { setActiveUserId, resetActiveUser } = activeUserSlice.actions;
export default activeUserSlice.reducer;