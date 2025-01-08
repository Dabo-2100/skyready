// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import aircraftFleetReducers from "../features/aircraft-fleet/state/__all-reducers";
const store = configureStore({
    reducer: {
        aircraftFleet: aircraftFleetReducers
    },
});

export default store;