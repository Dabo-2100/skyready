import { combineReducers } from '@reduxjs/toolkit';
import activeProjectReducer from "./activeProjectSlice";
import projectTaskStatusReducer from "./projectTaskStatusSlice";
import projectTasksFilterReducer from "./projectTasksFilterSlice";
import multiTasksSelectorReducer from "./multiTasksSelectorSlice"
const projectsReducers = combineReducers({
    activeProject: activeProjectReducer,
    projectTaskStatus: projectTaskStatusReducer,
    projectTasksFilter: projectTasksFilterReducer,
    multiTasksSelector: multiTasksSelectorReducer,
});

export default projectsReducers;