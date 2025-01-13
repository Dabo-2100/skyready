import { useContext } from "react";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext"
import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import { $Server, $SwalDark, $Token } from "../../../../store";
import { AircraftRepo } from "../../data/repositories/AircraftRepo";
import { formCheck } from "../../../../customHooks";
import { useSelector } from "react-redux";

export default function useAircraft() {
    const { closeModal, refresh } = useContext(HomeContext);
    const editAircaft_id = useSelector(state => state.aircraftFleet.activeAircraftId.value);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const darkSwal = useRecoilValue($SwalDark);

    const getAircraftInfo = async () => {
        return await AircraftRepo.aircraft_info(serverUrl, token, editAircaft_id);
    }

    const getAircraftZones = async (model_id) => {
        return await AircraftRepo.all_aircraft_zones(serverUrl, token, model_id);
    }

    const getAircraftFleet = async () => {
        return await AircraftRepo.all_aircraft_fleet(serverUrl, token);
    }

    const getAircraftFleetByModel = async (model_id) => {
        return await AircraftRepo.all_aircraft_fleet_by_model(serverUrl, token, model_id);
    }

    const getAircraftManufacturers = async () => {
        return await AircraftRepo.all_aircraft_manufacturers(serverUrl, token);
    }

    const getAircraftStatus = async () => {
        return await AircraftRepo.all_aircraft_status(serverUrl, token);
    }

    const getAircraftModels = async () => {
        return await AircraftRepo.all_aircraft_models(serverUrl, token);
    }

    const getAircraftUsages = async () => {
        return await AircraftRepo.all_aircraft_usages(serverUrl, token);
    }

    const getAircraftSpecialties = async () => {
        return await AircraftRepo.all_aircraft_specialties(serverUrl, token);
    }

    const getAircraftApplicableParts = async () => {
        return await AircraftRepo.aircraft_applicability(serverUrl, token, editAircaft_id);
    }

    const addNewAircraftToFleet = async (formInputs) => {
        let data = {
            aircraft_serial_no: formInputs.current[0].value,
            aircraft_register_no: formInputs.current[1].value,
            status_id: formInputs.current[2].value,
            manufacturer_id: formInputs.current[3].value,
            usage_id: formInputs.current[4].value,
            model_id: formInputs.current[5].value,
            aircraft_manufacture_date: formInputs.current[6].value,
            aircraft_flight_hours: formInputs.current[7].value,
        }
        let formErrors = formCheck([
            { value: formInputs.current[0].value, options: { required: true } },
            { value: formInputs.current[1].value, options: { required: true } },
            { value: formInputs.current[5].value, options: { required: true, notEqual: -1 } },
            { value: formInputs.current[2].value, options: { required: true, notEqual: -1 } },
            { value: formInputs.current[3].value, options: { required: true, notEqual: -1 } },
            { value: formInputs.current[4].value, options: { required: true, notEqual: -1 } },
        ])

        if (formErrors == 0) {
            AircraftRepo.register_new_aircraft(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
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

    const filterAircraftFleet = async (aircraftFleetArr, valueToSearch) => {
        let final = aircraftFleetArr.filter((el) => {
            if (
                el.aircraft_register_no.toLowerCase().includes(valueToSearch.toLowerCase()) ||
                el.aircraft_serial_no.toLowerCase().includes(valueToSearch.toLowerCase()) ||
                el.model_name.toLowerCase().includes(valueToSearch.toLowerCase())
            ) { return el }
        })
        return final;
    }

    const updateAircraftInfo = async (formInputs) => {
        let data = {
            aircraft_serial_no: formInputs.current[0].value,
            aircraft_register_no: formInputs.current[1].value,
            status_id: formInputs.current[2].value,
            manufacturer_id: formInputs.current[3].value,
            usage_id: formInputs.current[4].value,
            model_id: formInputs.current[5].value,
            aircraft_manufacture_date: formInputs.current[6].value,
            aircraft_flight_hours: formInputs.current[7].value,
        }
        let formErrors = formCheck([
            { value: formInputs.current[0].value, options: { required: true } },
            { value: formInputs.current[1].value, options: { required: true } },
            { value: formInputs.current[5].value, options: { required: true, notEqual: -1 } },
            { value: formInputs.current[2].value, options: { required: true, notEqual: -1 } },
            { value: formInputs.current[3].value, options: { required: true, notEqual: -1 } },
            { value: formInputs.current[4].value, options: { required: true, notEqual: -1 } },
        ])

        if (formErrors == 0) {
            AircraftRepo.update_aircraft_info(serverUrl, token, data, editAircaft_id).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "Aircraft data updated Successfully !" : res == undefined ? "Connection Problem" : res,
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

    const addNewManufacturer = async (newName) => {
        let data = {
            manufacturer_name: newName.current.value,
        }
        let formErrors = formCheck([
            { value: newName.current.value, options: { required: true } },
        ])

        if (formErrors == 0) {
            AircraftRepo.add_new_manufacturer(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Manufacturer Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
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

    const removeManufacturer = async (manufacturer_id) => {
        let data = {
            manufacturer_id: manufacturer_id,
        }
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this Manufacturer ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && AircraftRepo.delete_manufacturer(serverUrl, token, data).then((res) => {
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

    const addNewAircraftStatus = async (newName) => {
        let data = { status_name: newName.current.value };
        let formErrors = formCheck([{ value: newName.current.value, options: { required: true } }]);

        if (formErrors == 0) {
            AircraftRepo.add_new_aircraft_status(serverUrl, token, data).then((res) => {
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

    const removeAircraftStatus = async (stauts_id) => {
        let data = { status_id: +stauts_id }
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this Stauts ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && AircraftRepo.delete_aircraft_status(serverUrl, token, data).then((res) => {
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

    const addNewAircraftModel = async (newName) => {
        let data = { model_name: newName.current.value };
        let formErrors = formCheck([{ value: newName.current.value, options: { required: true } }]);

        if (formErrors == 0) {
            AircraftRepo.add_new_aircraft_model(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Model Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
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

    const removeAircraftModel = async (model_id) => {
        let data = { model_id: +model_id }
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this Model ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && AircraftRepo.delete_aircraft_model(serverUrl, token, data).then((res) => {
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

    const addNewAircraftUsage = async (newName) => {
        let data = { usage_name: newName.current.value };
        let formErrors = formCheck([{ value: newName.current.value, options: { required: true } }]);

        if (formErrors == 0) {
            AircraftRepo.add_new_aircraft_usage(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Model Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
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

    const removeAircraftUsage = async (usage_id) => {
        let data = { usage_id: +usage_id }
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this Model ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && AircraftRepo.delete_aircraft_usgae(serverUrl, token, data).then((res) => {
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

    const addNewAircraftSpeciality = async (newName) => {
        let data = { specialty_name: newName.current.value };
        let formErrors = formCheck([{ value: newName.current.value, options: { required: true } }]);

        if (formErrors == 0) {
            AircraftRepo.add_new_aircraft_speciality(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "New Aircraft Model Registered to Your Fleet !" : res == undefined ? "Connection Problem" : res,
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

    const removeAircraftSpeciality = async (specialty_id) => {
        let data = { specialty_id: +specialty_id }
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this Model ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            res.isConfirmed && AircraftRepo.delete_aircraft_speciality(serverUrl, token, data).then((res) => {
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

    return {
        addNewAircraftSpeciality, removeAircraftSpeciality, getAircraftZones,
        getAircraftFleet, filterAircraftFleet, getAircraftManufacturers, getAircraftFleetByModel,
        getAircraftStatus, getAircraftModels, getAircraftUsages, addNewAircraftToFleet, getAircraftSpecialties,
        getAircraftInfo, getAircraftApplicableParts, updateAircraftInfo, addNewAircraftModel, removeAircraftModel,
        addNewManufacturer, removeManufacturer, addNewAircraftStatus, removeAircraftStatus, addNewAircraftUsage, removeAircraftUsage
    }
}
