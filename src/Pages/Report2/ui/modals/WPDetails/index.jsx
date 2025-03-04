import { useEffect, useState } from "react";
import { useProjectDetailsModal, useRemainTasksModal, useWorkPackageModal } from "../../../../../store-zustand";
import styles from "./index.module.css";
export default function WPDetails() {
    const { openModal } = useRemainTasksModal();
    const { reportDetails, active_project_id } = useProjectDetailsModal();
    const { closeWorkPackage, active_workpackage_id } = useWorkPackageModal();
    const [activePackage, setActivePackage] = useState({ parts: [], package_info: {} });
    useEffect(() => {
        let project = reportDetails.find(el => el.project_id == active_project_id);
        let wp = project.details.project_parent_packages.find(el => el.package_id == active_workpackage_id);
        let parts = project.details.project_packages.filter(el => el.package_info.parent_id == active_workpackage_id);
        wp['parts'] = parts;
        wp['times'] = getProgress(parts);
        setActivePackage(wp);
        //eslint-disable-next-line
    }, []);

    const getProgress = (parts) => {
        let [totalTime, issuedTime, avinocsDoneTime, avionicsTime, structureDoneTime, structureTime] = [0, 0, 0, 0, 0, 0];
        parts.forEach(el => {
            avinocsDoneTime += el.Pkg_avionics_done_duration;
            avionicsTime += el.Pkg_avionics_duration;

            structureDoneTime += el.Pkg_structure_done_duration;
            structureTime += el.Pkg_structure_duration;

            totalTime += el.package_info.package_duration;
            issuedTime += el.package_info.package_issued_duration;
        });

        return ({
            issued_duration: issuedTime,
            estimated_duration: totalTime,
            avinocsDoneTime,
            avionicsTime,
            structureDoneTime,
            structureTime,
        })
    }
    return (
        <div className={styles.overlay} onClick={closeWorkPackage}>

            {
                activePackage.times && <div onClick={e => e.stopPropagation()} className="container p-0 h-100 overflow-auto bg-white rounded shadow border animate__animated animate__fadeIn" >
                    <div className="col-12 p-3 bg-dark text-white d-flex align-items-center justify-content-between">
                        <h3>{activePackage.package_name}</h3>
                        <button onClick={closeWorkPackage} className="btn btn-danger">Close</button>
                    </div>
                    <div className="col-12 d-flex flex-wrap text-center">
                        <div className="col-12 col-md-6 d-flex">
                            <p className="col-6 border p-3">Issued Duration</p>
                            <h6 className="col-6 border p-3 m-0">{activePackage.times.issued_duration} HRs</h6>
                        </div>
                        <div className="col-12 col-md-6 d-flex">
                            <p className="col-6 border p-3">Estimated Duration</p>
                            <h6 className="col-6 border p-3 m-0">{activePackage.times.estimated_duration} HRs</h6>
                        </div>

                        <div className="col-12 col-md-6 d-flex">
                            <p className="col-6 border p-3">Avionics Progress</p>
                            <h6 className="col-6 border p-3 m-0">
                                {(activePackage.times.avinocsDoneTime * 100 / activePackage.times.avionicsTime).toFixed(2)} %<br />
                                <p className="pt-2" style={{ fontSize: "10px" }}>
                                    [ {(activePackage.times.avinocsDoneTime).toFixed(1)} / {activePackage.times.avionicsTime.toFixed(1)} HRs]
                                </p>
                            </h6>
                        </div>
                        <div className="col-12 col-md-6 d-flex">
                            <p className="col-6 border p-3">Stucture Progress</p>
                            <h6 className="col-6 border p-3 m-0">{(activePackage.times.structureDoneTime * 100 / activePackage.times.structureTime).toFixed(2)} % <br />
                                <p className="pt-2" style={{ fontSize: "10px" }}>
                                    [ {(activePackage.times.structureDoneTime).toFixed(1)} / {activePackage.times.structureTime.toFixed(1)} HRs]
                                </p></h6>
                        </div>
                    </div>

                    <table className="table table-dark table-bordered text-center">
                        <thead>
                            <tr>
                                <th className="col-1">-</th>
                                <th className="col-5">Part No</th>
                                <th className="col-3">Part Duration</th>
                                <th className="col-3">Part Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                activePackage.parts.sort((a, b) => a.package_info.package_name.trim().localeCompare(b.package_info.package_name.trim())).map((el, index) => (
                                    <tr key={el.package_id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="d-flex flex-column align-items-center">
                                                <p className="text-center">{el.package_info.package_name}</p>
                                                <p className=" text-center" style={{ fontSize: "10px" }}>{el.package_info.package_desc}</p>
                                            </div>
                                        </td>
                                        <td className="p-0" style={{ verticalAlign: "middle", fontSize: "12px" }}>
                                            <div className="d-flex col-12 flex-column h-100">
                                                <p className="border col-12 p-2">{el.duration} HRs</p>
                                                <div className="border col-12 d-flex">
                                                    <div className="d-flex flex-column col-6">
                                                        <p className="border py-2">Avionics</p>
                                                        <p className="border py-2">{el.avionocs.duration.toFixed(1)} Hrs</p>
                                                    </div>

                                                    <div className="d-flex flex-column col-6">
                                                        <p className="border py-2">Structure</p>
                                                        <p className="border py-2">{el.structure.duration.toFixed(1)} Hrs</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-0" style={{ verticalAlign: "middle", fontSize: "12px" }}>
                                            <div className="d-flex col-12 flex-column h-100">
                                                <p className="border col-12 p-2">
                                                    {
                                                        ((el.Pkg_avionics_done_duration + el.Pkg_structure_done_duration) * 100 / (el.Pkg_avionics_duration + el.Pkg_structure_duration)).toFixed(2)
                                                    } %</p>
                                                <div className="border col-12 d-flex">
                                                    <div className="d-flex flex-column col-6">
                                                        <p className="border py-2">Avionics</p>
                                                        {
                                                            ((el.Pkg_avionics_done_duration) * 100 / (el.Pkg_avionics_duration)).toFixed(2) == 100 ?
                                                                (
                                                                    <p className="border py-2">{((el.Pkg_avionics_done_duration) * 100 / (el.Pkg_avionics_duration)).toFixed(2)} %</p>
                                                                ) :
                                                                (
                                                                    el.Pkg_avionics_done_duration == 0 ? "---" : <a onClick={() => openModal('Avionics', el.package_id)} className="border py-2 text-decoration-underline">{((el.Pkg_avionics_done_duration) * 100 / (el.Pkg_avionics_duration)).toFixed(2)} %</a>
                                                                )
                                                        }
                                                    </div>

                                                    <div className="d-flex flex-column col-6">
                                                        <p className="border py-2">Structure</p>

                                                        {
                                                            ((el.Pkg_structure_done_duration) * 100 / (el.Pkg_structure_duration)).toFixed(2) == 100 ?
                                                                (
                                                                    <p className="border py-2">{((el.Pkg_structure_done_duration) * 100 / (el.Pkg_structure_duration)).toFixed(2)} %</p>
                                                                ) :
                                                                (
                                                                    el.Pkg_structure_done_duration == 0 ? "---" : <a onClick={() => openModal('Structure', el.package_id)} className="border py-2 text-decoration-underline">{((el.Pkg_structure_done_duration) * 100 / (el.Pkg_structure_duration)).toFixed(2)} %</a>
                                                                )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            }

        </div>
    )
}



