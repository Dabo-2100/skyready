import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import useAircraftData from "../hooks/useAircraftData";
import useAircraft from "../hooks/useAircraft";

export default function NewManufacturer() {
    const { addNewManufacturer, removeManufacturer } = useAircraft();
    const { manufacturers } = useAircraftData();
    const new_manufact_name = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        addNewManufacturer(new_manufact_name);
    }

    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-content-center justify-content-between">
                <h1 className="fs-5">Add new Manufacturer</h1>
            </header>
            <main className="col-12 d-flex flex-wrap">
                <form className="col-12 d-flex flex-wrap gap-3" onSubmit={handleSubmit}>
                    <div className="col-12 inputField">
                        <label className="col-12 col-lg-5" htmlFor="mn">Manufacturer Name</label>
                        <div className="col-12 d-flex gap-4">
                            <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_manufact_name} placeholder="Enter manufacturer name" />
                            <button className="saveButton">
                                <div className="svg-wrapper-1"><div className="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path></svg></div></div>
                                <span>Save</span>
                            </button>
                        </div>
                    </div>
                </form>
            </main>
            <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                <p className="col-12">Manufacturers list</p>
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
                            manufacturers.map((el, index) => {
                                return (
                                    <tr key={el.manufacturer_id}>
                                        <td>{index + 1}</td>
                                        <td>{el.manufacturer_name}</td>
                                        <td>
                                            <FontAwesomeIcon icon={faX} onClick={() => removeManufacturer(el.manufacturer_id)} className="removeManu btn btn-danger" />
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