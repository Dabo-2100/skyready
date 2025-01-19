import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import SaveBtn from "../../../../Apps/Warehouse/UI/Components/SaveBtn";
import useAircraft from "../hooks/useAircraft";
import { useSelector } from "react-redux";

export default function NewSpecailty() {
    const specialties = useSelector(state => state.aircraftFleet.aircraftSpecialties.value);
    const { addNewAircraftSpeciality, removeAircraftSpeciality } = useAircraft();
    const new_specialty_name = useRef();
    const handleSubmit = () => { addNewAircraftSpeciality(new_specialty_name).then(() => { new_specialty_name.current.value = "" }) }
    const handleDelete = (specialty_id) => { removeAircraftSpeciality(specialty_id) }
    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-content-center justify-content-between">
                <h1 className="fs-5">New Specialty</h1>
            </header>
            <main className="col-12 d-flex flex-wrap">
                <div className="col-12 d-flex flex-wrap gap-3" >
                    <div className="col-12 inputField">
                        <label className="col-12 col-lg-5" htmlFor="mn">Specialty Name</label>
                        <div className="col-12 d-flex gap-4">
                            <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_specialty_name} placeholder="Enter Specialty name" />
                            <SaveBtn label="Save" onClick={handleSubmit} />
                        </div>
                    </div>
                </div>
            </main>
            <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                <p className="col-12 fw-medium">Aircraft Status list</p>
                <table className="table table-bordered table-dark text-center">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Status Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            specialties.map((el, index) => {
                                return (
                                    <tr key={el.specialty_id}>
                                        <td>{index + 1}</td>
                                        <td>{el.specialty_name}</td>
                                        <td>
                                            <FontAwesomeIcon icon={faX} onClick={() => handleDelete(el.specialty_id)} className="removeManu btn btn-danger" />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </footer>

        </Modal>
    )
}