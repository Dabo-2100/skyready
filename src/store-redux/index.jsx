import { configureStore } from '@reduxjs/toolkit';
import homeReducers from '../shared/state/__all-reducers';
import projectsReducers from '../features/project-manager/state/__all-reducers';
import aircraftFleetReducers from "../features/aircraft-fleet/state/__all-reducers";
const store = configureStore({
    reducer: {
        home: homeReducers,
        aircraftFleet: aircraftFleetReducers,
        projects: projectsReducers,
    },
});

export default store;