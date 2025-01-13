import aircraftFleetTabIndexReducer from './aircraftFleetTabIndexSlice';
import activeWorkPackageTypeIdReducer from './activeWorkPackageTypeIdSlice';
import activeAircraftIdReducer from './activeAircraftIdSlice';
import activePackageIdReducer from './activeWorkPackageIdSlice';
import activeWorkPackageFolderIdReducer from './activeWorkPackageFolderIdSlice';
import activeWorkPackageTaskIdReducer from './activeWorkPackageTaskIdSlice';
import activeSpecialityIdReducer from './activeSpecialityIdSlice';
import selectedZonesReducer from './selectedZonesSlice';
import selectedDesignatorsReducer from './selectedDesignatorsSlice';
import aircraftZonesReducer from './aircraftZonesSlice';
import activeZoneIdReducer from './activeZoneIdSlice';
import activeWorkPackageTaskReducer from './activeWorkPackageTaskSlice';
import { combineReducers } from '@reduxjs/toolkit';

const aircraftFleetReducers = combineReducers({
    aircraftFleetTabIndex: aircraftFleetTabIndexReducer,
    activeAircraftId: activeAircraftIdReducer,
    activeWorkPackageId: activePackageIdReducer,
    activeWorkPackageTypeId: activeWorkPackageTypeIdReducer,
    activeWorkPackageFolderId: activeWorkPackageFolderIdReducer,
    activeSpecialityId: activeSpecialityIdReducer,
    selectedZones: selectedZonesReducer,
    selectedDesignators: selectedDesignatorsReducer,
    aircraftZones: aircraftZonesReducer,
    activeZoneId: activeZoneIdReducer,
    activeWorkPackageTaskId: activeWorkPackageTaskIdReducer,
    activeWorkPackageTask: activeWorkPackageTaskReducer,
});

export default aircraftFleetReducers;