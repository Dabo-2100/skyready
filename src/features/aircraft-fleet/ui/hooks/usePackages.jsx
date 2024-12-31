import { useRecoilState, useRecoilValue } from "recoil";
import { $Server, $SwalDark, $Token } from "../../../../store";
// import { AircraftRepo } from "../../data/repositories/AircraftRepo";
// import { formCheck } from "../../../../customHooks";
// import Swal from "sweetalert2";
// import { useContext } from "react";
// import { HomeContext } from "../../../../Pages/HomePage/HomeContext"
// import { AircraftFleetContext } from "../../AircraftFleetContext";
import { WorkPackagesRepo } from "../../data/repositories/WorkPackagesRepo";
import { buildTree } from "../../../../shared/utilities/buildTree";

export default function usePackages() {
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const darkSwal = useRecoilState($SwalDark);
    // const { closeModal, refresh } = useContext(HomeContext);
    // const { editAircaft_id } = useContext(AircraftFleetContext);

    const getWorkPackageTypes = async () => {
        return await WorkPackagesRepo.all_workpackages_types(serverUrl, token);
    }

    const getWorkPackages = async (workpackage_type_id) => {
        let workPackages = await WorkPackagesRepo.all_workpackages(serverUrl, token, workpackage_type_id);
        console.log(workPackages);
        return buildTree(workPackages).sort((a, b) => a.package_name.localeCompare(b.package_name))
    }

    return { getWorkPackageTypes, getWorkPackages }

}