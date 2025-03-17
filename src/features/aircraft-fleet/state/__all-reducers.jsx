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
import activeAircraftModelIdReducer from './activeAircraftModelIdSlice';
import activeParentZonekReducer from './activeParentZoneSlice';
import workPackagesReducer from './workPackagesSlice';
import workPackageTypesReducer from './workPackageTypesSlice';
import aircraftSpecailtiesReducer from './aircraftSpecialtiesSlice';
import activeWorkPackageInfoReducer from './activeWorkPackageInfoSlice';
import aircraftModelsReducer from './aircraftModelsSlice';
import aircraftFleetReducer from './aircraftFleetSlice';
import aircraftStatusReducer from './aircraftStatusSlice';
import aircraftUsageReducer from './aircraftUsagesSlice';
import aircraftmanufacturersReducer from './aircraftManufacturersSlice';

import { combineReducers } from '@reduxjs/toolkit';

const aircraftFleetReducers = combineReducers({
    aircraftFleetTabIndex: aircraftFleetTabIndexReducer,
    activeAircraftId: activeAircraftIdReducer,
    activeAircraftModelId: activeAircraftModelIdReducer,
    activeWorkPackageId: activePackageIdReducer,
    activeWorkPackageTypeId: activeWorkPackageTypeIdReducer,
    activeWorkPackageFolderId: activeWorkPackageFolderIdReducer,
    activeWorkPackageTaskId: activeWorkPackageTaskIdReducer,
    activeWorkPackageTask: activeWorkPackageTaskReducer,
    activeWorkPackageInfo: activeWorkPackageInfoReducer,
    activeSpecialityId: activeSpecialityIdReducer,


    selectedZones: selectedZonesReducer,
    selectedDesignators: selectedDesignatorsReducer,
    aircraftSpecialties: aircraftSpecailtiesReducer,
    aircraftZones: aircraftZonesReducer,
    aircraftFleet: aircraftFleetReducer,

    aircraftModels: aircraftModelsReducer,
    aircraftStatus: aircraftStatusReducer,
    aircraftUsages: aircraftUsageReducer,
    aircraftManufacturers: aircraftmanufacturersReducer,

    activeZoneId: activeZoneIdReducer,
    activeParentZone: activeParentZonekReducer,
    workPackages: workPackagesReducer,
    workPackageTypes: workPackageTypesReducer,
});

export default aircraftFleetReducers;