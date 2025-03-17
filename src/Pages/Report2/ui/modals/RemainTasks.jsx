import { useEffect, useState } from "react";
import { serverUrl, useProjectDetailsModal, useRemainTasksModal, useWorkPackageModal } from "../../../../store-zustand";
import styles from "./RemainTasks.module.css";
import { ReportRepo } from "../../data/repositories/ReportRepo";
export default function RemainTasks() {
    const [openedPackage, setOpenedPackage] = useState({});
    const { closeModal, speciality: speciality_name, active_part_id: package_id } = useRemainTasksModal();
    const { active_project_id: project_id, reportDetails } = useProjectDetailsModal();
    const { active_workpackage_id: parent_package_id } = useWorkPackageModal();

    useEffect(() => {
        let data = { project_id, package_id, speciality_name };
        let project = reportDetails.find(el => el.project_id == project_id);
        let wp = project.details.project_packages.find(el => el.package_id == package_id);
        let parent = project.details.project_parent_packages.find(el => el.package_id == parent_package_id);
        let wpFullName = parent.package_name + (parent.package_name && " | ") + wp.package_info.package_name.trim();
        wp = { ...wp, wpFullName, speciality_name };
        ReportRepo.get_remian_tasks(serverUrl, data).then((res) => {
            wp['tasks'] = res;
            setOpenedPackage(wp);
            // console.log(res);
        })
    }, []);
    return (
        <div className={styles.overlay} onClick={closeModal}>
            {
                openedPackage.tasks &&
                <div onClick={e => e.stopPropagation()} className="container p-0 h-100 overflow-auto bg-white rounded border shadow p-3 animate__animated animate__fadeInUp">
                    <div className="bg-dark p-3 text-white d-flex align-items-center justify-content-between">
                        <h4 className="mb-0">{openedPackage.wpFullName} Remain {openedPackage.speciality_name} Tasks</h4>
                        <button className="btn btn-danger" onClick={closeModal}>close</button>
                    </div>
                    <table className="table table-dark table-bordered text-center">
                        <thead>
                            <tr>
                                <th>-</th>
                                <th>Task Name</th>
                                <th>Task Desc</th>
                                <th>Task Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {openedPackage.tasks.map((el, index) => (
                                <tr key={el.task_id}>
                                    <td>{index + 1}</td>
                                    <td>{el.task_name}</td>
                                    <td>{el.task_desc || el.task_type_name}</td>
                                    <td><p className="bg-warning p-2 rounded shadow border text-dark fw-bolder">{el.status_name}</p></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

        </div>
    )
}
