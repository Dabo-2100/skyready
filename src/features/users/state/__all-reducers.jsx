import activeUserSlice from './activeUserSlice';
import { combineReducers } from '@reduxjs/toolkit';

const userManagerReducers = combineReducers({
    activeUser: activeUserSlice,
});

export default userManagerReducers;