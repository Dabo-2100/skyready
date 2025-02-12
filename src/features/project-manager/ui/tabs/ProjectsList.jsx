import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { $LoaderIndex } from "@/store-recoil";
import { User } from "../../../../shared/core/User";
import { $UserInfo } from "../../../../store-recoil";
import { useDispatch, useSelector } from "react-redux";
import useProjects from "../hooks/useProjects";
import { setActiveId, setProjectInfo, setActivePackages, setAvailablePackages } from "../../state/activeProjectSlice";
import { resetTableView, setTableView } from "../../state/projectTasksFilterSlice";
import { openModal } from "../../../../shared/state/modalSlice";

export default function ProjectsList() {
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const refreshIndex = useSelector(state => state.home.refreshIndex.value);
  const dispatch = useDispatch();
  const { getAllProjects, getProjectPackages,removeProject } = useProjects();
  const [projects, setProjects] = useState([]);

  const openProject = (id) => {
    (localStorage.getItem("tableView") && dispatch(setTableView(JSON.parse(localStorage.getItem("tableView"))))) || dispatch(resetTableView())
    dispatch(setActiveId(id));
    dispatch(setProjectInfo(projects.find((el) => { return el.project_id == id })));
    getProjectPackages(id).then((result) => {
      let res = result[0];
      let x = res.applicable_work_packages.map((el) => {
        let index = res.active_work_packages.findIndex((wp) => { return wp.work_package_id == el.package_id })
        return (index == -1) && el
      })
      let final = x.filter(item => typeof item === 'object' && item !== null);
      dispatch(setAvailablePackages(final));
      dispatch(setActivePackages(res.active_work_packages));
    }).then(() => dispatch(openModal(6001)))
  }

  const handleRemove = (event, project_id) => {
    event.stopPropagation();
    removeProject(project_id);
  }

  useEffect(() => {
    setLoaderIndex(true);
    getAllProjects().then(setProjects).then(() => setLoaderIndex(false));
    // eslint-disable-next-line
  }, [refreshIndex]);

  const user = new User(useRecoilValue($UserInfo));
  const appIndex = useSelector(state => state.home.activeAppIndex.value);

  return (
    <div className="col-12 d-flex flex-wrap p-3 Tab flex-grow-1" style={{ minHeight: "1vh" }} id="allProjectsTab">
      <div className="col-12 content d-flex flex-column justify-content-start rounded-4 p-3 gap-3 animate__animated animate__fadeInUp">
        <header className="col-12 d-flex align-items-center justify-content-between">
          <h5 className="m-0">Projects List</h5>
          {
            user.isAppAdmin(appIndex) && (
              <button className="btn addBtn d-flex gap-2 align-items-center" onClick={() => dispatch(openModal(6000))}>
                <FontAwesomeIcon icon={faPlus} /> New Project
              </button>
            )
          }
        </header>
        <div className="col-12 d-flex overflow-auto align-items-start flex-grow-1" style={{ height: "1vh" }}>
          <table className="table table-dark table-bordered table-hover text-center">
            <thead>
              <tr>
                <th>No</th>
                <th>Project Name</th>
                <th>Aircraft S/N</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Progress %</th>
                <th>Status</th>
                {
                  user.isAppAdmin(appIndex) && <th>Actions</th>
                }
              </tr>
            </thead>
            <tbody>
              {
                projects.map((pro, index) => {
                  return (
                    <tr key={pro.project_id} onClick={() => openProject(pro.project_id)}>
                      <td>{index + 1}</td>
                      <td>{pro.project_name}</td>
                      <td>{pro.aircraft_serial_no}</td>
                      <td>{pro.project_start_date}</td>
                      <td>{pro.project_due_date}</td>
                      <td>{pro.project_progress && pro.project_progress.toFixed(2)} %</td>
                      <td><p style={{ color: pro.status_color_code }}></p>{pro.status_name}</td>
                      {
                        user.isAppAdmin(appIndex) && (
                          <td><button onClick={(event) => handleRemove(event, pro.project_id)} className="btn btn-danger">Remove</button></td>
                        )
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
