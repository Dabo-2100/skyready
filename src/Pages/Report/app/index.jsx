import { useState } from "react";
import styles from "./index.module.css";
import { ReportRepo } from "../data/repositories/ReportRepo";
import { useRecoilValue } from "recoil";
import { $Server } from "../../../store-recoil";
import ProjectDetails from "../ui/modals/ProjectDetails";
import { useProjectDetailsModal, useWorkPackageModal } from "../../../store-zustand";
import WPDetails from "../ui/modals/WPDetails";
export default function ReportFinal() {
    const serverURl = useRecoilValue($Server);
    const [projects, setProjects] = useState([]);
    const { index, openDetails, setReportDetails } = useProjectDetailsModal();
    const { index: wpIndex, openWorkPackage } = useWorkPackageModal();

    useState(() => {
        ReportRepo.all_projects(serverURl).then((res) => {
            setProjects(res);
            setReportDetails(res);
        });
    }, []);

    return (
        <div className={styles['report-page']}>
            {index && <ProjectDetails />}
            {wpIndex && <WPDetails />}
            <div className="container d-flex flex-column bg-white rounded shadow p-3">
                <h5 className="bg-dark text-center text-white mx-2 py-3">Active Projects</h5>
                <div className="col-12 d-flex flex-wrap">
                    {
                        projects.map((el, index) => {
                            return (
                                <div key={index} className="col-12 col-md-6 col-lg-4 p-2">
                                    <div className="col-12 bg-white rounded border border-dark shadow d-flex rounded-3 flex-column">
                                        <h5 className="bg-dark text-white p-3 fs-5 mb-0 rounded-top">{el.project_name}</h5>
                                        <div className="col-12 p-3 d-flex flex-column gap-2">
                                            <div className="col-12 d-flex justify-content-between align-items-center">
                                                <p className="text-success fw-bold fs-6">Project Progress</p>
                                                <span className="text-primary text-decoration-underline" style={{ cursor: "pointer" }} onClick={() => openDetails(el.project_id)}>View Details</span>
                                            </div>
                                            <div className={"col-12 mb-3 " + styles.progressBar}>
                                                <div className={styles.bar} style={{ width: (el.project_progress) + "%" }}></div>
                                                <h6 className={"col-12 text-center mb-0 " + styles.value}>{el.project_progress.toFixed(2)}%</h6>
                                            </div>
                                            <div className="col-12 d-flex flex-column gap-2 ">
                                                <div className="col-12 d-flex align-items-center justify-content-between" style={{ fontSize: "10px" }}>
                                                    <p>Avionics Progress</p>
                                                    <div className="d-flex align-items-center gap-2">

                                                        <span className="text-danger" style={{ fontSize: "9px" }}>
                                                            (Remain : {((el.details.project_avionics_duration) - el.details.project_avionics_done_duration).toFixed(0)} Hrs)
                                                        </span>
                                                        <span>
                                                            {((el.details.project_avionics_done_duration * 100) / el.details.project_avionics_duration).toFixed(2)}%
                                                        </span>

                                                    </div>
                                                </div>
                                                <div className="progress">
                                                    <div className="progress-bar bg-dark" role="progressbar"
                                                        style={{ width: ((el.details.project_avionics_done_duration * 100) / el.details.project_avionics_duration).toFixed(2) + "%" }}
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                            <div className="col-12 d-flex flex-column gap-2 ">
                                                <div className="col-12 d-flex align-items-center justify-content-between" style={{ fontSize: "10px" }}>
                                                    <p>Structure Progress</p>
                                                    <span >
                                                        {((el.details.project_structure_done_duration * 100) / el.details.project_structure_duration).toFixed(2)}%
                                                    </span>
                                                </div>
                                                <div className="progress">
                                                    <div className="progress-bar bg-dark" role="progressbar"
                                                        style={{ width: ((el.details.project_structure_done_duration * 100) / el.details.project_structure_duration).toFixed(2) + "%" }}
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

