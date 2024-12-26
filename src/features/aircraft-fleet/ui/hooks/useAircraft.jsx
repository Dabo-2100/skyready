import { useRecoilState, useRecoilValue } from "recoil";
import { $Server, $SwalDark, $Token } from "../../../../store";
import { AircraftRepo } from "../../data/repositories/AircraftRepo";
import { formCheck } from "../../../../customHooks";
import Swal from "sweetalert2";
import { useContext } from "react";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext"
import { AircraftFleetContext } from "../../AircraftFleetContext";

export default function useAircraft() {
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const darkSwal = useRecoilState($SwalDark);
    const { closeModal } = useContext(HomeContext);
    const { editAircaft_id } = useContext(AircraftFleetContext);

    const getAircraftInfo = async () => {
        return await AircraftRepo.aircraft_info(serverUrl, token, editAircaft_id);
    }

    const getAircraftFleet = async () => {
        return await AircraftRepo.all_aircraft_fleet(serverUrl, token);
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

    return {
        getAircraftFleet, filterAircraftFleet, getAircraftManufacturers,
        getAircraftStatus, getAircraftModels, getAircraftUsages, addNewAircraftToFleet,
        getAircraftInfo, getAircraftApplicableParts, updateAircraftInfo
    }
}
