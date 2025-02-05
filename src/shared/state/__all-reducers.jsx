import { combineReducers } from '@reduxjs/toolkit';
import refreshIndexReducer from "./refreshIndexSlice";
import activeAppIndexReducer from "./activeAppIndexSlice";
import contextMenuReducer from "./contextMenuSlice";
import modalReducer from "./modalSlice";

const homeReducers = combineReducers({
    refreshIndex: refreshIndexReducer,
    activeAppIndex: activeAppIndexReducer,
    contextMenu: contextMenuReducer,
    modals: modalReducer,
});

export default homeReducers;