import { useContext, useState, useEffect } from "react";
import { ReportContext } from "../ReportContext";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Server, $Token } from "@/store";
import { useGetData } from "@/customHooks.jsx";
import BarChart from "@/Components/BarChart";

export default function WP_Progress() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    // ======================================>
    const { activeProject, setActiveWP, setModalIndex } = useContext(ReportContext);
    // ======================================>
    const [wps, setWps] = useState([]);
    const [gauge, setGauge] = useState({});
    // ======================================>
    const getProjectPackages = () => {
        let project_id = activeProject;
        if (project_id) {
            setLoaderIndex(true);
            let q = `
                SELECT 
                wp.package_name,
                wp.package_id,
                wp.package_issued_duration,
                (SELECT wp2.package_id FROM work_packages wp2 WHERE wp2.package_id = wp.parent_id) As parent_id,
                (SELECT wp2.package_name FROM work_packages wp2 WHERE wp2.package_id = wp.parent_id) As parent_name,
                (SELECT SUM(task_duration) FROM work_package_tasks WHERE package_id = wp.package_id) AS package_duration,
                (SELECT work_package_progress FROM project_work_packages WHERE work_package_id = wp.package_id AND project_id=${project_id}) AS package_progress,
                (SELECT log_id FROM project_work_packages WHERE work_package_id = wp.package_id AND project_id=${project_id}) AS package_log_id
                FROM work_package_applicability wpa 
                JOIN work_packages wp ON wp.package_id = wpa.package_id
                WHERE wpa.aircraft_id = (SELECT aircraft_id FROM app_projects WHERE project_id = ${project_id})
                ORDER BY parent_name,package_name
            `;
            useGetData(serverUrl, token, q).then((res) => {
                setTimeout(() => {
                    setLoaderIndex(false);
                    const groupedPackages = res.reduce((acc, pkg) => {
                        const parentId = pkg.parent_id;
                        if (!acc[parentId]) {
                            acc[parentId] = {
                                parent_id: parentId,
                                parent_name: pkg.parent_name,
                                parent_package_duration: 0, // Total duration of the parent package
                                parent_issued_duration: 0,
                                done_parent_progress: 0, // To be calculated
                                children: [] // Array for child packages
                            };
                        }
                        // Add the duration to the parent's total duration
                        acc[parentId].parent_package_duration += pkg.package_duration;
                        acc[parentId].parent_issued_duration += pkg.package_issued_duration;
                        // Add the package to the children array
                        acc[parentId].children.push(pkg);
                        return acc;
                    }, {});
                    Object.values(groupedPackages).forEach(group => {
                        let totalProgress = 0;
                        group.children.forEach(pkg => {
                            if (pkg.package_progress !== null) {
                                // Calculate the progress contribution of each child
                                totalProgress += (pkg.package_progress / 100) * pkg.package_duration;
                            }
                        });
                        // Calculate the overall progress for the parent package
                        group.done_parent_progress = ((totalProgress / group.parent_package_duration) * 100).toFixed(2);
                    });
                    const result = Object.values(groupedPackages);
                    setWps(result);
                    let totalProjectHrs = 0;
                    let totalDoneHrs = 0;
                    result.forEach((el, index) => {
                        totalProjectHrs += el.parent_package_duration;
                        totalDoneHrs += ((el.done_parent_progress / 100) * el.parent_package_duration)
                    });
                    let percentage = totalDoneHrs / totalProjectHrs;
                    setGauge({
                        totalHrs: totalProjectHrs.toFixed(),
                        totalDone: totalDoneHrs.toFixed(),
                        percentage: (percentage * 100).toFixed(2),
                    })
                }, 500);
            }).catch(err => console.log(err));
        }
    }
    const openDetails = (id) => {
        setActiveWP(id);
        setModalIndex(true);
    }
    // ======================================>
    useEffect(() => {
        getProjectPackages();
    }, [activeProject])

    return (
        <>
            <div className="col-12 col-md-5 d-flex p-3 flex-wrap align-content-start align-items-start gap-2 overflow-y-auto" style={{ maxHeight: "75vh" }}>
                <h4 className="col-12">Project Workpackages</h4>
                <table className="table table-bordered table-dark table-hover text-center">
                    <thead>
                        <tr>
                            <th>-</th>
                            <th>Name</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wps.map((wp, index) => {
                            return (
                                <tr key={index} onClick={() => openDetails(wp)}>
                                    <td>{index + 1}</td>
                                    <td>{wp.parent_name && `${wp.parent_name}`}</td>
                                    <td>{wp.done_parent_progress} %</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ cursor: "pointer" }} className="col-12 col-md-7">
                <h3>
                    Progress : {gauge.percentage} %
                </h3>
                <BarChart
                    labels={wps.map(el => el.parent_name)}
                    datasets={[
                        {
                            label: 'Workpackage Progress',
                            data: wps.map(el => el.done_parent_progress),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                    ]}
                />
            </div>
        </>
    )
}