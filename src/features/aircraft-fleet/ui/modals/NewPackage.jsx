import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import usePackages from "../hooks/usePackages";
import { useDispatch, useSelector } from "react-redux";
import { resetActiveId } from "../../state/activeWorkPackageFolderIdSlice";
import { openModal2 } from "../../../../shared/state/modalSlice";
import Modal from "../../../../shared/ui/modals/Modal";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";

export default function NewPackage() {
    const dispatch = useDispatch();
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);
    const workPackages = useSelector(state => state.aircraftFleet.workPackages.value);
    const workPackageTypes = useSelector(state => state.aircraftFleet.workPackageTypes.value);
    const activeFolderWorkPackageId = useSelector(state => state.aircraftFleet.activeWorkPackageFolderId.value);
    const activeWorkPackageTypeId = useSelector(state => state.aircraftFleet.activeWorkPackageTypeId.value);
    const [activeChildren, setActiveChildren] = useState([]);
    const [is_folder, setIs_Folderolder] = useState(false);
    const { addNewFolderPackage, removeFolderPackage } = usePackages();
    const new_package_name = useRef();

    const handleDelete = (package_id) => { removeFolderPackage(package_id) }
    const handleSubmit = () => {
        addNewFolderPackage(new_package_name, activeFolderWorkPackageId, activeWorkPackageTypeId).then(() => {
            new_package_name.current.value = "";
        })
    }

    useEffect(() => {
        if (activeFolderWorkPackageId == 0) {
            setActiveChildren(workPackages.filter(el => el.parent_id == null));
        } else {
            setActiveChildren(workPackages.filter(el => el.parent_id == activeFolderWorkPackageId));
        }
        // eslint-disable-next-line
    }, [workPackages, refreshIndex]);

    useEffect(() => {
        return () => { dispatch(resetActiveId()) }
    }, []);
    return (
        <Modal>
            <header className="col-12 p-0 pb-2 px-3 d-flex align-content-center justify-content-between">
                <h1 className="fs-5">Add
                    {
                        workPackageTypes.length > 0 && " " + workPackageTypes.find(el => el.package_type_id == activeWorkPackageTypeId)['package_type_name']
                    }
                </h1>
            </header>

            <main className="col-12 d-flex flex-wrap justify-content-center gap-2">
                <button className="fileButton col-5" onClick={() => { setIs_Folderolder(!is_folder) }}>
                    <svg className="svg-icon" width="24" viewBox="0 0 24 24" height="24" fill="none"><g strokeWidth="2" strokeLinecap="round" stroke="#056dfa" fillRule="evenodd" clipRule="evenodd"><path d="m3 7h17c.5523 0 1 .44772 1 1v11c0 .5523-.4477 1-1 1h-16c-.55228 0-1-.4477-1-1z"></path><path d="m3 4.5c0-.27614.22386-.5.5-.5h6.29289c.13261 0 .25981.05268.35351.14645l2.8536 2.85355h-10z"></path></g></svg>
                    <span className="lable">Folder Package</span>
                </button>

                <button className="fileButton col-5" onClick={() => dispatch(openModal2(4001))}>
                    <svg aria-hidden="true" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path strokeWidth="2" stroke="#fffffff" d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" strokeLinejoin="round" strokeLinecap="round"></path>
                        <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#fffffff" d="M17 15V18M17 21V18M17 18H14M17 18H20"></path>
                    </svg>
                    <span className="lable">Detailed Package</span>
                </button>
                {
                    is_folder && (
                        <div className="col-12 d-flex flex-wrap border-top pt-3 mt-2" >
                            <div className="col-12 inputField">
                                <label className="col-12 col-lg-5" htmlFor="mn">Package Name</label>
                                <div className="col-12 d-flex gap-4 justify-content-between">
                                    <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_package_name} placeholder="Enter New Type name" />
                                    <SaveBtn label="Add" onClick={handleSubmit} />
                                </div>
                            </div>
                        </div>
                    )
                }

            </main>
            {

                activeChildren.length > 0
                && (<footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                    <p className="col-12 fs-5 fw-medium">{
                        workPackageTypes.length > 0 && workPackageTypes.find(el => el.package_type_id == activeWorkPackageTypeId)['package_type_name']
                    } <span> list</span></p>
                    <table className="table table-bordered table-dark text-center">
                        <thead>
                            <tr>
                                <th>-</th>
                                <th>{workPackageTypes.length > 0 && workPackageTypes.find(el => el.package_type_id == activeWorkPackageTypeId)['package_type_name']} Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                activeChildren.map((el, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{el.package_name}</td>
                                            <td><FontAwesomeIcon icon={faX} onClick={() => handleDelete(el.package_id)} className="removeManu btn btn-danger" /></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </footer>)
            }
        </Modal>
    )
}