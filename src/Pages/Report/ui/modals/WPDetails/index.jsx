import { useEffect, useState } from "react";
import { useProjectDetailsModal, useWorkPackageModal } from "../../../../../store-zustand";
import styles from "./index.module.css";
export default function WPDetails() {
    const { reportDetails, active_project_id } = useProjectDetailsModal();
    const { closeWorkPackage, active_workpackage_id } = useWorkPackageModal();
    const [activePackage, setActivePackage] = useState({});
    useEffect(() => {
        let project = reportDetails.find(el => el.project_id == active_project_id);
        console.log(project);
        // let wp = project.find()
        // setActiceProject(obj);
        // console.log(obj)
        //eslint-disable-next-line
    }, []);
    return (
        <div className={styles.overlay} onClick={closeWorkPackage}>
            <div onClick={e => e.stopPropagation()} className="col-12 col-md-8 h-100 overflow-auto bg-white rounded shadow border animate__animated animate__fadeIn" >
                <div className="col-12 p-3 bg-dark text-white d-flex align-items-center justify-content-between">
                    <h3>Service Bulltien</h3>
                    <button onClick={closeWorkPackage} className="btn btn-danger">Close</button>
                </div>
                <div className="col-12 d-flex flex-wrap text-center">
                    <div className="col-12 col-md-6 d-flex">
                        <p className="col-6 border p-3">Issued Duration</p>
                        <h6 className="col-6 border p-3 m-0">30 HRs</h6>
                    </div>
                    <div className="col-12 col-md-6 d-flex">
                        <p className="col-6 border p-3">Estimated Duration</p>
                        <h6 className="col-6 border p-3 m-0">40 HRs</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}
