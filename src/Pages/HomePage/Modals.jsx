
// Fleet App Modals
import NewAircraft from "@/Apps/Fleet/Modals/NewAircraft";
import NewStatus from "@/Apps/Fleet/Modals/NewStatus";
import NewManufacturer from "@/Apps/Fleet/Modals/NewManufacturer";
import NewModel from "@/Apps/Fleet/Modals/NewModel";
import NewUsage from "@/Apps/Fleet/Modals/NewUsage";
import EditAircraft from "@/Apps/Fleet/Modals/EditAircraft";
import NewSpecailty from "@/Apps/Fleet/Modals/NewSpecialty";
import NewPackageType from "@/Apps/Fleet/Modals/NewPackageType";
import NewPackage from "@/Apps/Fleet/Modals/NewPackage";
import NewDetailedPackage from "@/Apps/Fleet/Modals/NewDetailedPackage";
import EditDetailedPackage from "@/Apps/Fleet/Modals/EditDetailedPackage";
import NewPackageTask from "@/Apps/Fleet/Modals/NewPackageTask";
import NewPackageTaskType from "@/Apps/Fleet/Modals/NewPackageTaskType";
import NewAircraftZone from "@/Apps/Fleet/Modals/NewAircraftZone";
import Designators from "@/Apps/Fleet/Modals/Designators";
import EditPackageTask from "@/Apps/Fleet/Modals/EditPackageTask";
// Projects App Modals
import NewProject from "@/Apps/Projects/Modals/NewProject";
import ProjectView from "@/Apps/Projects/Modals/ProjectView";
import StartWorkPackage from "../../Apps/Projects/Modals/StartWorkPackage.jsx";
// Users App Modals
import NewUser from "@/Apps/Users/Modals/NewUser.jsx";
import EditUser from "@/Apps/Users/Modals/EditUser.jsx";
import NewWarehouse from "../../Apps/Warehouse/UI/Modals/NewWarehouse.jsx";
import AircraftZones from "../../Apps/Fleet/Modals/AircraftZones.jsx";
import TasksVsZones from "../../Apps/Fleet/Modals/TasksVsZones.jsx";
import NewLocation from "../../Apps/Warehouse/UI/Modals/NewLocation.jsx";
import WarehouseDetails from "../../Apps/Warehouse/UI/Modals/WarehouseDetails.jsx";
import NewItem from "../../Apps/Warehouse/UI/Modals/NewItem.jsx";
import ItemCategories from "../../Apps/Warehouse/UI/Modals/ItemCategories.jsx";
import UnitsControl from "../../Apps/Warehouse/UI/Modals/UnitsControl.jsx";
import NewNotice from "../../Apps/Warehouse/UI/Modals/NewNotice.jsx";
import NewPacklist from "../../Apps/Warehouse/UI/Modals/NewPacklist.jsx";

export const allModals = [
    { index: 1001, component: <NewAircraft /> },
    { index: 1002, component: <NewManufacturer /> },
    { index: 1003, component: <NewStatus /> },
    { index: 1004, component: <NewModel /> },
    { index: 1005, component: <NewUsage /> },
    { index: 1006, component: <NewAircraftZone /> },
    { index: 1007, component: <Designators /> },
    { index: 2000, component: <EditAircraft /> },
    { index: 2001, component: <AircraftZones /> },
    { index: 2002, component: <TasksVsZones /> },
    { index: 3000, component: <NewPackageType /> },
    { index: 4000, component: <NewPackage /> },
    { index: 4001, component: <NewDetailedPackage /> },
    { index: 4002, component: <EditDetailedPackage /> },
    { index: 4003, component: <NewPackageTask /> },
    { index: 4004, component: <NewPackageTaskType /> },
    { index: 4005, component: <EditPackageTask /> },
    { index: 5000, component: <NewSpecailty /> },
    { index: 6000, component: <NewProject /> },
    { index: 6001, component: <ProjectView /> },
    { index: 6002, component: <StartWorkPackage /> },
    { index: 7000, component: <NewUser /> },
    { index: 7001, component: <EditUser /> },
    { index: 8000, component: <NewWarehouse /> },
    { index: 8001, component: <WarehouseDetails /> },
    { index: 8002, component: <NewLocation /> },
    { index: 8003, component: <NewItem /> },
    { index: 8004, component: <ItemCategories /> },
    { index: 8005, component: <UnitsControl /> },
    { index: 8006, component: <NewNotice /> },
    { index: 8007, component: <NewPacklist /> },
];