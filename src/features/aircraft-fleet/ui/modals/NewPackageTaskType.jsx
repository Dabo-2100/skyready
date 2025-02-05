import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import usePackages from "../hooks/usePackages";

import Modal from "../../../../shared/ui/modals/Modal";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";


export default function NewPackageTaskType() {
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const active_speciality_id = useSelector(state => state.aircraftFleet.activeSpecialityId.value);
    const { getWorkPackageTaskTypes } = usePackages();
    const [taskTypes, setTaskTypes] = useState([]);
    const new_type_name = useRef();
    const { addNewWorkPackageTaskType, removeWorkPackageTaskType } = usePackages();
    const handleSubmit = () => { addNewWorkPackageTaskType(new_type_name, active_speciality_id) }
    const handleDelete = (type_id) => { removeWorkPackageTaskType(type_id) }

    useEffect(() => {
        getWorkPackageTaskTypes(active_speciality_id).then((res) => { setTaskTypes(res) })
    }, [active_speciality_id, refreshIndex]);

    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-content-center justify-content-between">
                <h1 className="fs-5">New Task Type</h1>
            </header>
            <main className="col-12 d-flex flex-wrap">
                <div className="col-12 d-flex flex-wrap gap-3" >
                    <div className="col-12 inputField">
                        <label className="col-12 col-lg-5" htmlFor="mn">Task Type Name</label>
                        <div className="col-12 d-flex gap-4">
                            <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_type_name} placeholder="Enter Task Type name" />
                            <SaveBtn label="Save" onClick={handleSubmit} />
                        </div>
                    </div>
                </div>
            </main>
            <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                <p className="col-12">Task Types list</p>
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
                            taskTypes.map((el, index) => {
                                return (
                                    <tr key={el.type_id}>
                                        <td>{index + 1}</td>
                                        <td>{el.type_name}</td>
                                        <td>
                                            <FontAwesomeIcon icon={faX} onClick={() => handleDelete(el.type_id)} className="removeManu btn btn-danger" />
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