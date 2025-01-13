import { combineReducers } from '@reduxjs/toolkit';
import refreshIndexReducer from "./refreshIndexSlice";
import activeAppIndexReducer from "./activeAppIndexSlice";

const homeReducers = combineReducers({
    refreshIndex: refreshIndexReducer,
    activeAppIndex: activeAppIndexReducer,
});

export default homeReducers;