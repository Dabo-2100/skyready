import aircraftFleetTabIndexReducer from './aircraftFleetTabIndexSlice';
import activeWorkPackageTypeIdReducer from './activeWorkPackageTypeIdSlice';
import activeAircraftIdReducer from './activeAircraftIdSlice';
import activePackageIdReducer from './activeWorkPackageIdSlice';
import activeWorkPackageFolderIdReducer from './activeWorkPackageFolderIdSlice';
import activeWorkPackageTaskIdReducer from './activeWorkPackageTaskIdSlice';
import { combineReducers } from '@reduxjs/toolkit';

const aircraftFleetReducers = combineReducers({
    aircraftFleetTabIndex: aircraftFleetTabIndexReducer,
    activeAircraftId: activeAircraftIdReducer,
    activeWorkPackageId: activePackageIdReducer,
    activeWorkPackageTypeId: activeWorkPackageTypeIdReducer,
    activeWorkPackageFolderId: activeWorkPackageFolderIdReducer,
    activeWorkPackageTaskId: activeWorkPackageTaskIdReducer,
});

export default aircraftFleetReducers;