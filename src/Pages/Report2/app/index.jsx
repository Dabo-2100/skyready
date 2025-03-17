import styles from "./index.module.css";
import logoUrl from "../../../assets/IPACOLogo.png";
import { useState } from "react";
import { useEffect } from "react";
import { KpiRepo } from "../data/repositories/KpiRepo";
import { serverUrl, useLoader } from "../../../store-zustand";

export default function AlbertoReport() {
    const { setLoaderIndex } = useLoader();
    const [isLoading, setIsLoading] = useState(true);
    const [activeProjects, setActiveProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(-1);
    const [activeProjectInfo, setActiveProjectInfo] = useState();

    const giveMeNo = (no) => {
        return isNaN(no) ? 0 : no;
    }
    useEffect(() => {
        setLoaderIndex(true);
        KpiRepo.index_projects(serverUrl).then((res) => {
            res.map(project => {
                let parent_pkgs = project.details.project_parent_packages;
                let final = parent_pkgs.map(sb => {
                    let [issued_duration, estimated_durration, totalDone] = [0, 0, 0, 0, 0];
                    let sb_parts = project.details.project_packages.filter(el => el.package_info.parent_id == sb.package_id);
                    sb_parts.forEach(part => {
                        totalDone += part.Pkg_avionics_done_duration + part.Pkg_structure_done_duration;
                        estimated_durration += part.duration;
                        issued_duration += part.package_info.package_issued_duration;
                    });
                    sb['package_duration'] = +estimated_durration.toFixed(0);
                    sb['package_percentage'] = +((totalDone / estimated_durration) * 100).toFixed(2);
                    sb['package_issued_duration'] = +issued_duration;
                    sb['parts'] = sb_parts;
                    return sb;
                });
                project.details.project_parent_packages = final;
                return project;
                // console.log(final);
            });

            setActiveProjects(res);
            setTimeout(() => {
                setLoaderIndex(false); setIsLoading(false);
            }, 800);
            console.log(res);
        })
        // eslint-disable-next-line
    }, []);

    const handleChange = () => {
        setActiveProject(event.target.value);
        setActiveProjectInfo(activeProjects.find(el => el.project_id == event.target.value));
    }

    return (
        <div className={styles.report}>
            <header className="col-12">
                <div className="container border-0 col-12 d-flex flex-wrap align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <img height={30} src={logoUrl} alt="IPACO Logo" />
                        <p className={styles.logoName}>SkyReady</p>
                    </div>
                    <h3 className={"text-white " + styles.reportHeader}>KPI Report</h3>
                </div>
            </header>
            {
                !isLoading &&
                <div className="container col-12 d-flex flex-column animate__animated animate__fadeInUp">
                    <div className="col-12 d-flex align-items-center py-3 gap-3" id={styles.selector}>
                        <div className="col-6 col-md-4 flex-grow-1 flex-md-grow-0">
                            <select className="form-select" value={activeProject} onChange={handleChange}>
                                <option disabled hidden value={-1}>Select Helicopter S/N</option>
                                {
                                    activeProjects.map((el) => (
                                        <option key={el.project_id} value={el.project_id}>{el.project_name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
            }

            {
                activeProject != -1 &&
                <div className="container col-12 overflow-auto">
                    <table className="table table-dark table-bordered text-center align-middle">
                        <thead>
                            <tr>
                                <td colSpan={3}>Total</td>
                                <td>{activeProjectInfo.details.project_parent_packages.reduce((acc, el) => acc + el.package_issued_duration, 0)} HRs</td>
                                <td>{activeProjectInfo.details.project_parent_packages.reduce((acc, el) => acc + +giveMeNo(el.package_issued_duration - (((((el.package_issued_duration - el.package_duration) / el.package_issued_duration) * 100).toFixed(0) / 2) / 100) * el.package_issued_duration).toFixed(0), 0)} HRs</td>
                                <td>{activeProjectInfo.details.project_parent_packages.reduce((acc, el) => acc + el.package_duration, 0)} HRs</td>
                            </tr>
                            <tr>
                                <th>-</th>
                                <th>Service Bulltien</th>
                                <th>Applicable Parts</th>
                                <th>Leonardo Estimated Duration</th>
                                <th>IPACO Estimated Duration</th>
                                <th>IPACO Employment Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                activeProjectInfo && activeProjectInfo.details.project_parent_packages.sort((a, b) => a.package_name.trim().localeCompare(b.package_name.trim())).map((el, index) => (
                                    <tr key={el.package_id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="d-flex flex-column gap-1 align-items-center">
                                                <p>{el.package_name}</p>
                                                {el.package_percentage != 0 && <span>( {el.package_percentage}% )</span>}
                                            </div>
                                        </td>
                                        <td className="p-0">
                                            <div className="d-flex flex-column h-100 w-100">
                                                {el.parts.sort((a, b) => a.package_info.package_name.trim().localeCompare(b.package_info.package_name.trim())).map((part, index) => (
                                                    <p
                                                        style={{
                                                            borderBottom: ((el.parts.length - 1) > index) ? "1px solid #4d5154" : null
                                                        }}
                                                        className={"flex-grow-1 p-2 text-center w-100 m-0"} key={part.package_id}
                                                    >
                                                        {part.package_info.package_name}
                                                    </p>
                                                ))}
                                            </div>
                                        </td>
                                        <td>{el.package_issued_duration} HRs</td>
                                        <td>
                                            <div className="d-flex gap-2 justify-content-center">
                                                <p>
                                                    {(el.package_issued_duration - (((((el.package_issued_duration - el.package_duration) / el.package_issued_duration) * 100).toFixed(0) / 2) / 100) * el.package_issued_duration).toFixed(0)}
                                                </p> <p> HRs</p>

                                            </div>
                                        </td>
                                        <td>{el.package_duration} HRs</td>
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
