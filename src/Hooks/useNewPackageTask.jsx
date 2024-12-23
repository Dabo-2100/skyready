import Swal from "sweetalert2";
import { formCheck, reOrderTasks } from "../customHooks";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { $Server, $SwalDark, $Token } from "../store";
import { useContext } from "react";
import { FleetContext } from "../Apps/Fleet/FleetContext";
import useDatabase from "./useDatabase";
import { HomeContext } from "../Pages/HomePage/HomeContext";

export default function useNewPackageTask() {
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const darkSwal = useRecoilValue($SwalDark);
    const { refresh, closeModal } = useContext(HomeContext)
    const { selectedZones, selectedDesignators, openPackage_id } = useContext(FleetContext)
    const { dbInsert } = useDatabase();

    const handleSubmit = async (taskInputs) => {
        console.log(taskInputs.current[3].props);
        let taskName = taskInputs.current[0].value;
        let taskDuration = taskInputs.current[1].value;
        let specialtyId = taskInputs.current[2].value;
        let taskTypeId = (taskInputs.current[2].value && taskInputs.current[3] && taskInputs.current[3].props.value.value) || -1;
        let task_desc = taskInputs.current[4].value;
        const obj = {
            "package_id": openPackage_id,
            "task_name": taskName,
            "task_duration": taskDuration,
            "specialty_id": specialtyId,
            "task_type_id": taskTypeId,
            "task_desc": task_desc,
        };
        let data = [
            { value: taskName, options: { required: true } },
            { value: taskDuration, options: { required: true } },
            { value: specialtyId, options: { notEqual: -1 } },
            { value: taskTypeId, options: { notEqual: -1 } },
        ];
        let hasErrors = formCheck(data);
        if (hasErrors != 0) {
            Swal.fire({
                icon: "error",
                text: "Please fill required data !",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        } else {
            try {
                const response = await axios.post(`${serverUrl}/php/index.php/api/workpackage/tasks/store`, obj, { headers: { Authorization: `Bearer ${token}` } });
                if (!response.data.err) {
                    const task_id = response.data['task_id'];
                    const zonesInsertPromises = selectedZones.map(
                        (zone) => {
                            let zone_id = zone.zone_id;
                            dbInsert("tasks_x_zones", { task_id, zone_id })
                        }
                    );

                    const designatorsPromises = selectedDesignators.map((el) => {
                        let designator_id = el.designator_id;
                        dbInsert("tasks_x_designators", { task_id, designator_id })
                    }
                    );

                    await Promise.all(zonesInsertPromises);
                    await Promise.all(designatorsPromises);
                    await reOrderTasks(serverUrl, token, openPackage_id);

                    Swal.fire({
                        icon: "success",
                        text: "New Task Added Succssefully to Your work package!",
                        customClass: darkSwal,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        refresh();
                        closeModal();
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: response.data.msg.errorInfo[2],
                        customClass: darkSwal,
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return { handleSubmit }
}
