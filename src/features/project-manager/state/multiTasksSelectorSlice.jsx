import { createSlice } from '@reduxjs/toolkit';
const multiTasksSelectorSlice = createSlice({
    name: 'multiTasksSelector',
    initialState: {
        index: false,
        selectAllIndex: false,
        tasks: [],
    },
    reducers: {
        toggleSeletor: (state) => { state.index = !state.index },
        toggleTask: (state, action) => {
            let taskIndex = state.tasks.findIndex(el => el.log_id == action.payload.log_id);
            taskIndex == -1 ? state.tasks.push(action.payload) : state.tasks.splice(taskIndex, 1);
        },
        unselectAllTasks: (state) => { state.tasks = []; state.selectAllIndex = false },
        selectAllTasks: (state, action) => { state.tasks = [...action.payload]; state.selectAllIndex = true },
        resetSelector: (state) => { state.tasks = []; state.index = false; state.selectAllIndex = false; }
    },
},
);

export const { toggleSeletor, unselectAllTasks, toggleTask, resetSelector, selectAllTasks } = multiTasksSelectorSlice.actions;
export default multiTasksSelectorSlice.reducer;