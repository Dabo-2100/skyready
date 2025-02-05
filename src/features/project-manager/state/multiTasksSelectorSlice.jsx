import { createSlice } from '@reduxjs/toolkit';
const multiTasksSelectorSlice = createSlice({
    name: 'multiTasksSelector',
    initialState: { index: false, tasks: [] },
    reducers: {
        toggleSeletor: (state) => { state.index = !state.index },
        toggleTask: (state, action) => {
            let taskIndex = state.tasks.findIndex(el => el.task_id == action.payload.task_id);
            taskIndex == -1 ? state.tasks.push(action.payload) : state.tasks.splice(taskIndex, 1);
        },
        selectAllTasks: (state, action) => { state.tasks = [...action.payload] },
        resetSelector: (state) => { state.index = false, state.tasks = [] }
    },
},
);

export const { toggleSeletor, toggleTask, resetSelector, selectAllTasks } = multiTasksSelectorSlice.actions;
export default multiTasksSelectorSlice.reducer;