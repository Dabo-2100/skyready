import { useEffect, useState } from "react";
import { useProjectDetailsModal, useWorkPackageModal } from "../../../../store-zustand";
import styles from "./ProjectDetails.module.css";
import BarChart from "../../../../shared/ui/components/BarChart";
export default function ProjectDetails() {
    const [activeProject, setActiceProject] = useState({});
    const { closeDetails, active_project_id, reportDetails } = useProjectDetailsModal();
    const { openWorkPackage } = useWorkPackageModal();
    useEffect(() => {
        let obj = reportDetails.find(el => el.project_id == active_project_id);
        setActiceProject(obj);
        console.log(obj)
        //eslint-disable-next-line
    }, []);


    const getPackageProgress = (package_id) => {
        let sons = activeProject.details.project_packages.filter(el => el.package_info.parent_id == package_id);
        let [totalDone, totalTime] = [0, 0];
        sons.forEach(el => {
            totalDone += (el.Pkg_avionics_done_duration + el.Pkg_structure_done_duration);
            totalTime += (el.Pkg_avionics_duration + el.Pkg_structure_duration);
        });
        return (totalDone * 100 / totalTime).toFixed(2);
    }

    return (
        <div className={styles.projectDetails} onClick={closeDetails}>
            <div onClick={e => e.stopPropagation()} className="container p-0 bg-white rounded border shadow border-dark h-100 overflow-y-auto animate__animated animate__fadeInDown d-flex flex-column">
                <div className="col-12 p-3 bg-dark text-white rounded-top d-flex justify-content-between align-items-center">
                    <h5>{activeProject.project_name}</h5>
                    <button onClick={closeDetails} className="btn btn-danger">Close</button>
                </div>
                {
                    activeProject.details && (
                        <div className={styles['report-body'] + " col-12 d-flex flex-wrap"}>
                            <div className="col-12 border border d-flex flex-wrap">
                                <div className="col-12 col-md-6 border d-flex">
                                    <p className="col-6 p-3 border d-flex justify-content-center align-items-center">Project Progress</p>
                                    <p className="col-6 p-3 border text-center d-flex flex-column flex-md-row align-items-center justify-content-center column-gap-2">
                                        <span className="fw-bolder">
                                            {(((activeProject.details.project_avionics_done_duration + activeProject.details.project_structure_done_duration) / (activeProject.details.project_avionics_duration + activeProject.details.project_structure_duration)) * 100).toFixed(2)} %
                                        </span>
                                        <span style={{ fontSize: "10px" }}>
                                            {(activeProject.details.project_avionics_done_duration + activeProject.details.project_structure_done_duration).toFixed(0)}
                                            /
                                            {(activeProject.details.project_avionics_duration + activeProject.details.project_structure_duration).toFixed(0)} HRs
                                        </span>
                                    </p>
                                </div>
                                <div className="col-12 col-md-6 border d-flex">
                                    <p className="col-6 p-3 border d-flex justify-content-center align-items-center">Service Bulltiens No</p>
                                    <p className="col-6 p-3 border text-center d-flex flex-column flex-md-row align-items-center justify-content-center column-gap-2">
                                        <span className="fw-bolder">
                                            {activeProject.details.project_parent_packages.length}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 border border d-flex flex-wrap">
                                <div className="col-12 col-md-6 border d-flex">
                                    <p className="col-6 p-3 border d-flex justify-content-center align-items-center">Avionics Progress</p>
                                    <p className="col-6 p-3 border text-center d-flex flex-column flex-md-row align-items-center justify-content-center column-gap-2">
                                        <span className="fw-bolder">
                                            {(((activeProject.details.project_avionics_done_duration) / (activeProject.details.project_avionics_duration)) * 100).toFixed(2)} %
                                        </span>
                                        <span style={{ fontSize: "10px" }}>
                                            {(activeProject.details.project_avionics_done_duration).toFixed(0)}
                                            /
                                            {(activeProject.details.project_avionics_duration).toFixed(0)} HRs
                                        </span>
                                    </p>
                                </div>

                                <div className="col-12 col-md-6 border d-flex">
                                    <p className="col-6 p-3 border d-flex justify-content-center align-items-center">Structure Progress</p>
                                    <p className="col-6 p-3 border text-center d-flex flex-column flex-md-row align-items-center justify-content-center column-gap-2">
                                        <span className="fw-bolder">
                                            {(((activeProject.details.project_structure_done_duration) / (activeProject.details.project_structure_duration)) * 100).toFixed(2)} %
                                        </span>
                                        <span style={{ fontSize: "10px" }}>
                                            {(activeProject.details.project_structure_done_duration).toFixed(0)}
                                            /
                                            {(activeProject.details.project_structure_duration).toFixed(0)} HRs
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 d-flex flex-column">
                                <h4 className="p-3 mb-0">Service Bulltiens</h4>
                                <div className="col-12 d-flex flex-wrap">
                                    <div className="col-12 col-md-6 px-3 order-2 order-md-1">
                                        <table className="table table-dark text-center text-center table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Service Bulltien</th>
                                                    <th>Progress %</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    activeProject.details.project_parent_packages.sort((a, b) => a.package_name.trim().localeCompare(b.package_name.trim())).map((el, index) => {
                                                        return (
                                                            <tr key={el.package_id} onClick={() => openWorkPackage(el.package_id)}>
                                                                <td>{index + 1}</td>
                                                                <td>{el.package_name}</td>
                                                                <td>{getPackageProgress(el.package_id)} %</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-12 col-md-6 px-3 order-1 order-md-2">
                                        <BarChart
                                            labels={activeProject.details.project_parent_packages.sort((a, b) => a.package_name.trim().localeCompare(b.package_name.trim())).map(el => el.package_name)}
                                            datasets={
                                                [{
                                                    label: 'SBs Progress',
                                                    data: activeProject.details.project_parent_packages.sort((a, b) => a.package_name.trim().localeCompare(b.package_name.trim())).map(el => getPackageProgress(el.package_id)),
                                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                                    borderColor: 'rgba(75, 192, 192, 1)',
                                                    borderWidth: 1,
                                                }]
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div >
    )
}