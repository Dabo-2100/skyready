
// Aircraft Fleet Modals
import NewAircraft from "../../features/aircraft-fleet/ui/modals/NewAircraft.jsx";
import EditAircraft from "../../features/aircraft-fleet/ui/modals/EditAircraft.jsx";
import NewStatus from "../../features/aircraft-fleet/ui/modals/NewAircraftStatus.jsx";
import NewModel from "../../features/aircraft-fleet/ui/modals/NewModel.jsx";
import NewUsage from "../../features/aircraft-fleet/ui/modals/NewUsage.jsx";
import NewManufacturer from "../../features/aircraft-fleet/ui/modals/NewManufacturer.jsx";
import NewPackageType from "../../features/aircraft-fleet/ui/modals/NewPackageType.jsx";
import NewPackage from "../../features/aircraft-fleet/ui/modals/NewPackage.jsx";
import EditDetailedPackage from "../../features/aircraft-fleet/ui/modals/EditDetailedPackage.jsx";
import NewDetailedPackage from "../../features/aircraft-fleet/ui/modals/NewDetailedPackage.jsx";
import NewPackageTask from "../../features/aircraft-fleet/ui/modals/NewPackageTask.jsx";
import NewSpecailty from "../../features/aircraft-fleet/ui/modals/NewSpecialty.jsx";
import NewPackageTaskType from "../../features/aircraft-fleet/ui/modals/NewPackageTaskType.jsx";
import NewAircraftZone from "../../features/aircraft-fleet/ui/modals/NewAircraftZone.jsx";
import EditPackageTask from "../../features/aircraft-fleet/ui/modals/EditPackageTask.jsx";
import TaskDesignators from "../../features/aircraft-fleet/ui/modals/TaskDesignators.jsx";
// ------------------------------------------------------------------>
// Projects App Modals
import NewProject from "../../features/project-manager/ui/modals/NewProject.jsx";
import ProjectView from "../../features/project-manager/ui/modals/ProjectView.jsx";
import StartWorkPackage from "../../features/project-manager/ui/modals/StartWorkPackage.jsx";
// Users App Modals
import NewUser from "../../features/users/ui/modals/NewUser.jsx";
import EditUser from "../../features/users/ui/modals/EditUser.jsx";
// Warehouse App Modals

export const allModals = [
    { index: 1001, component: <NewAircraft /> },
    { index: 1002, component: <NewManufacturer /> },
    { index: 1003, component: <NewStatus /> },
    { index: 1004, component: <NewModel /> },
    { index: 1005, component: <NewUsage /> },
    { index: 1006, component: <NewAircraftZone /> },
    { index: 1007, component: <TaskDesignators /> },
    { index: 2000, component: <EditAircraft /> },
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
];