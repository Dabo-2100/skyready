import { useContext, useEffect, useState } from "react";
import "./index.scss";
import logo from "@/assets/IPACOLogo.png";
import { useGetData } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $LoaderIndex, $Server, $Token } from "@/store-recoil";
import WP_Progress from "./Components/WP_Progress";
import { ReportContext } from "./ReportContext";
import Detailed_WP from "./Modals/Detailed_WP";
import Departement_Progress from "./Components/Departement_Progress";

export default function ReportPage() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    // ======================================>
    const [projects, setProjects] = useState(["", ""]);
    // ======================================>
    const { reportIndex, setReportIndex, activeProject, setActiveProject, modalIndex } = useContext(ReportContext);
    // ======================================>
    const showContent = () => {
        switch (reportIndex) {
            case 1:
                return <WP_Progress />;
            case 2:
                return <Departement_Progress />
            default:
                return <h1>Report Not Ready Yet</h1>;
        }
    }

    const getActiveProjects = async () => {
        let final = [];
        let q = `SELECT * FROM app_projects WHERE status_id != 4`;
        await useGetData(serverUrl, token, q).then((res) => {
            final = res;
        }).catch(err => console.log(err));
        return final;
    }
    // ======================================>
    useEffect(() => {
        getActiveProjects().then((res) => {
            setProjects(res);
            setActiveProject(res[0].project_id);
        });
    }, []);
    return (
        <div className='col-12 d-flex px-3 align-items-center justify-content-center' id="ReportPage">
            <div className="container d-flex flex-column gap-3 align-content-start align-items-start" id="reportContent">
                <header className="col-12 d-flex flex-wrap rounded shadow">
                    <div className="col-12 d-flex gap-3 gap-md-0 flex-wrap align-items-center p-2 justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                            <img src={logo} width={50} />
                            <h5 className="mb-0">SkyReady Reports</h5>
                        </div>
                        <div className="col-12 col-md-4">
                            <select className="form-select" onChange={(event) => { setReportIndex(+event.target.value) }}>
                                <option value="1">Workpackages Progress</option>
                                <option value="2">Departement Progress</option>
                            </select>
                        </div>
                    </div>
                    <hr className="col-12 m-0" />
                    <div className="col-12 topBar">
                        <ul className="col-12 m-0 p-0 d-flex flex-wrap list-unstyled">
                            {
                                projects.map((tab, index) => {
                                    return (<li key={index} onClick={() => setActiveProject(tab.project_id)} className={`py-3 px-3 ${tab.project_id == activeProject ? 'activeLink' : null}`}>{tab.project_name}</li>)
                                })
                            }
                        </ul>
                    </div>
                </header>
                <main className="col-12 d-flex flex-wrap rounded shadow">
                    {showContent()}
                </main>
            </div>
            {
                modalIndex && <Detailed_WP />
            }
        </div>
    )
}