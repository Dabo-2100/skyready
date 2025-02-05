import { useContext, useEffect, useRef, useState } from "react"
import { ProjectsContext } from "../../../../Apps/Projects/ProjectContext";
import { useRecoilState, useRecoilValue } from "recoil";
import { $Server, $Token, $SwalDark, $UserInfo, $LoaderIndex } from "@/store";
import BarChart from "../../../../Apps/Projects/Components/BarChart";

import { useDashboard, useAircraftStatus, getAircraftByModel, useAircraftModels, useAircraftUsages, formCheck } from "@/customHooks";
import axios from "axios";
import Swal from "sweetalert2";
import ProgressBar from "../../../../Apps/Projects/Components/ProgressBar";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import { User } from "../../../../shared/core/User";
import { useSelector } from "react-redux";

export default function ProjectDashboard() {
    const { closeModal, refreshIndex } = useContext(HomeContext);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);

    const { openedProject } = useContext(ProjectsContext);
    const [dashboardInfo, setDashboardInfo] = useState({});
    const [editInfoIndex, setEditInfoIndex] = useState(false);

    const new_project_name = useRef();
    const new_project_desc = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    const handelRemove = () => {
        Swal.fire({
            icon: "error",
            text: "Are you sure you want to remove this project ?",
            showCancelButton: true,
            showConfirmButton: true,
        }).then(async (res) => {
            res.isConfirmed && await axios.get(`${serverUrl}/php/index.php/api/projects/remove/${openedProject}`, { headers: { Authorization: `Bearer ${token}` } })
                .then(() => {
                    Swal.fire({
                        icon: "success",
                        text: "Project removed Successfully !",
                        timer: 1500,
                    }).then(() => {
                        closeModal();
                    })
                })
                .catch((err) => { console.log(err); })
        })
    }
    const user = new User(useRecoilValue($UserInfo));
    const appIndex = useSelector(state => state.home.activeAppIndex.value);
    useEffect(() => {
        setLoaderIndex(true);
        useDashboard(serverUrl, token, openedProject).then((res) => {
            setDashboardInfo(res[0]);
            setLoaderIndex(false);
        })
    }, [refreshIndex]);
    return (
        <div className="col-12 d-flex flex-wrap gap-3" id="Dashboard">
            <div className="widget d-flex flex-wrap gap-3 col-12 p-3 rounded-2" >
                <header className="col-12 d-flex flex-wrap align-items-center justify-content-between">
                    <h1 className="fs-5">Project Info</h1>
                    {
                        user.isAppAdmin(appIndex) && (
                            <div className="d-flex align-content-center gap-3">
                                <button className="btn btn-danger" onClick={handelRemove}>Remove Project</button>
                                <button className="editButton">Edit
                                    <svg viewBox="0 0 512 512" className="svg"> <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                </button>
                            </div>
                        )
                    }
                    <hr className="col-12 m-0 mt-2" />
                </header>
                <main className="col-12">
                    <form className="col-12 d-flex flex-wrap align-items-start gap-3 pb-3 justify-content-lg-between" onSubmit={handleSubmit}>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Project Name</label>
                            <input disabled={!editInfoIndex} defaultValue={dashboardInfo.project_name} className="col-12 form-control" type="text" id="sn" ref={new_project_name} placeholder="Enter Project Name" required />
                        </div>
                        <div className="col-12 col-lg-5 inputField">
                            <label className="col-12" htmlFor="sn">Project Description</label>
                            <textarea disabled={!editInfoIndex} defaultValue={dashboardInfo.project_desc} className="col-12 form-control" type="text" id="sn" ref={new_project_desc} placeholder="Enter Project Description" required />
                        </div>
                    </form>
                </main>
                <footer></footer>
            </div>
            <div className="widget d-flex flex-wrap gap-3 col-12 p-3 rounded-2" >
                <header className="col-12">
                    <h1 className="fs-5">Project Progress</h1>
                </header>
                <main className="col-12 d-flex flex-wrap">
                    <ProgressBar percentage={dashboardInfo.project_progress && dashboardInfo.project_progress.toFixed(2)} />
                    {/* <BarChart /> */}
                </main>
                <footer></footer>
            </div>
        </div>
    )
}
