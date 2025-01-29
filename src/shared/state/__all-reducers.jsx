import { combineReducers } from '@reduxjs/toolkit';
import refreshIndexReducer from "./refreshIndexSlice";
import activeAppIndexReducer from "./activeAppIndexSlice";
import contextMenuReducer from "./contextMenuSlice";

const homeReducers = combineReducers({
    refreshIndex: refreshIndexReducer,
    activeAppIndex: activeAppIndexReducer,
    contextMenu: contextMenuReducer,
});

export default homeReducers;