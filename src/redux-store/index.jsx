// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import aircraftFleetReducers from "../features/aircraft-fleet/state/__all-reducers";
import homeReducers from '../shared/state/__all-reducers';
const store = configureStore({
    reducer: {
        home: homeReducers,
        aircraftFleet: aircraftFleetReducers,
    },
});

export default store;