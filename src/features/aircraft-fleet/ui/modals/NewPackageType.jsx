import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import usePackagesData from "../hooks/usePackagesData";
import usePackages from "../hooks/usePackages";
import SaveBtn from "../../../../Apps/Warehouse/UI/Components/SaveBtn";

export default function NewPackageType() {
    const { addNewWorkPackageType, removeWorkPackageType } = usePackages();
    const { workPackageTypes: packgeTypes } = usePackagesData();
    const new_type_name = useRef();
    const handleSubmit = () => { addNewWorkPackageType(new_type_name).then(() => { new_type_name.current.value = "" }) }
    const handleDelete = (id) => { removeWorkPackageType(id) }

    return (
        <Modal>
            <header className="col-12 d-flex border-0 p-0 py-2 px-3 align-content-center justify-content-between">
                <h1 className="fs-5">Work Package Types</h1>
            </header>
            <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                <table className="table table-bordered table-dark text-center">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Type Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            packgeTypes.map((el, index) => {
                                return (
                                    <tr key={index} >
                                        <td>{index + 1}</td>
                                        <td>
                                            {el.package_type_name}
                                        </td>
                                        <td>
                                            <FontAwesomeIcon icon={faX} onClick={() => handleDelete(el.package_type_id)} className="removeManu btn btn-danger" />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

            </footer>
            <hr className="col-12 m-0" />
            <main className="col-12 d-flex flex-wrap">
                <div className="col-12 d-flex flex-wrap gap-3">
                    <div className="col-12 inputField">
                        <label className="col-12 col-lg-5 fw-bold fs-5" htmlFor="mn">Add New Type</label>
                        <div className="col-12 d-flex gap-4">
                            <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_type_name} placeholder="Enter New Type name" />
                            <SaveBtn label="Save" onClick={handleSubmit} />
                        </div>
                    </div>
                </div>
            </main>
        </Modal>
    )
}