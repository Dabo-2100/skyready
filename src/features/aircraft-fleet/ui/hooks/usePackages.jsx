import { useRecoilState, useRecoilValue } from "recoil";
import { $LoaderIndex, $Server, $SwalDark, $Token } from "../../../../store";
import { WorkPackagesRepo } from "../../data/repositories/WorkPackagesRepo";
import { buildTree } from "../../../../shared/utilities/buildTree";
import { formCheck } from "../../../../customHooks";
import Swal from "sweetalert2";
import { useContext } from "react";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";

export default function usePackages() {
    const token = useRecoilValue($Token);
    const serverUrl = useRecoilValue($Server);
    const darkSwal = useRecoilValue($SwalDark);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const { refresh, closeModal } = useContext(HomeContext);

    const getWorkPackageTypes = async () => {
        return await WorkPackagesRepo.all_workpackages_types(serverUrl, token);
    }

    const getWorkPackages = async (workpackage_type_id) => {
        let workPackages = await WorkPackagesRepo.all_workpackages(serverUrl, token, workpackage_type_id);
        return buildTree(workPackages).sort((a, b) => a.package_name.localeCompare(b.package_name))
    }

    const getWorkPackageTasks = async (work_package_id) => {
        return await WorkPackagesRepo.all_workpackage_tasks(serverUrl, token, work_package_id);
    }

    const addNewWorkPackageType = async (newName) => {
        let data = { package_type_name: newName.current.value };
        let formErrors = formCheck([{ value: newName.current.value, options: { required: true } }]);
        if (formErrors == 0) {
            await WorkPackagesRepo.add_new_workpackage_type(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Status Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && refresh();
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill All Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const addNewFolderPackage = async (newName, active_folder_id, active_type_id) => {
        let data = {
            package_name: newName.current.value,
            package_type_id: active_type_id,
            is_folder: 1,
            parent_id: active_folder_id
        };
        let formErrors = formCheck([{ value: newName.current.value, options: { required: true } }]);
        if (formErrors == 0) {
            await WorkPackagesRepo.add_new_folder_workpackage(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Status Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && refresh();
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill All Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const addNewDetailedWorkPackage = async (formInputs, work_package_applicability, parent_id, package_type_id) => {
        let data = {
            package_name: formInputs.current[0].value,
            package_desc: formInputs.current[1].value,
            package_version: formInputs.current[2].value,
            package_release_date: formInputs.current[3].value,
            package_issued_duration: formInputs.current[4].value,
            model_id: formInputs.current[5].value,
            work_package_applicability: work_package_applicability,
            package_type_id: package_type_id,
            is_folder: 0,
            parent_id: parent_id,
        };

        let formErrors = formCheck([
            { value: formInputs.current[0].value, options: { required: true } },
            { value: formInputs.current[5].value, options: { required: true, notEqual: -1 } },
            { value: work_package_applicability, options: { arrayNotEmpty: true } },
        ])

        if (formErrors == 0) {
            await WorkPackagesRepo.add_new_detailed_workpackage(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Status Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && closeModal();
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill All Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const updateWorkPackageInfo = async (formInputs, work_package_applicability, work_package_id) => {
        setLoaderIndex(true);
        let data = {
            package_name: formInputs.current[0].value,
            package_desc: formInputs.current[1].value,
            package_version: formInputs.current[2].value,
            package_release_date: formInputs.current[3].value,
            package_issued_duration: formInputs.current[4].value,
            model_id: formInputs.current[5].value,
            work_package_applicability: work_package_applicability,
        }
        let formErrors = formCheck([
            { value: formInputs.current[0].value, options: { required: true } },
            { value: formInputs.current[5].value, options: { required: true, notEqual: -1 } },
            { value: work_package_applicability, options: { arrayNotEmpty: true } },
        ])

        if (formErrors == 0) {
            WorkPackagesRepo.update_workpackage_info(serverUrl, token, data, work_package_id).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    setLoaderIndex(false);
                    res == true && refresh();
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill All Required Data",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const removeFolderPackage = async (work_package_id) => {
        let data = { package_id: +work_package_id }
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this WorkPackage ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && WorkPackagesRepo.delete_folder_workpackage(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "Manufacturer Deleted Successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && refresh();
                })
            })
        })

    }

    const removeWorkPackageType = async (workpackageType_id) => {
        let data = { package_type_id: +workpackageType_id }
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this WorkPackage Type ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && WorkPackagesRepo.delete_workpackage_type(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "Manufacturer Deleted Successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                    customClass: darkSwal,
                }).then(() => {
                    res == true && refresh();
                })
            })
        })
    }

    return { getWorkPackageTypes, addNewDetailedWorkPackage, getWorkPackages, addNewWorkPackageType, removeWorkPackageType, addNewFolderPackage, removeFolderPackage, getWorkPackageTasks, updateWorkPackageInfo }

}