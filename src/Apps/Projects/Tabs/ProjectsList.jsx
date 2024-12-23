import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../ProjectContext";
import { useProjects } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark, $LoaderIndex } from "@/store";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import { User } from "../../Warehouse/Core/User";

export default function ProjectsList() {
  const [serverUrl] = useRecoilState($Server);
  const [token] = useRecoilState($Token);
  const [darkSwal] = useRecoilState($SwalDark);
  const [, setLoaderIndex] = useRecoilState($LoaderIndex);
  const [projects, setProjects] = useState([]);
  const { openModal, refreshIndex } = useContext(HomeContext);
  const { setOpenedProject } = useContext(ProjectsContext);
  const openProject = (id) => {
    setOpenedProject(id)
    openModal(6001);
  }
  useEffect(() => {
    setLoaderIndex(true);
    useProjects(serverUrl, token).then((res) => {
      setProjects(res);
      setLoaderIndex(false)
    })
  }, [refreshIndex]);

  const user = new User();

  return (
    <div className="col-12 d-flex flex-wrap p-3 Tab flex-grow-1" style={{ minHeight: "1vh" }} id="allProjectsTab">
      <div className="col-12 content d-flex flex-column justify-content-start rounded-4 p-3 gap-3 animate__animated animate__fadeInUp">
        <header className="col-12 d-flex align-items-center justify-content-between">
          <h5 className="m-0">Projects List</h5>
          {
            user.isAdmin() && (
              <button className="btn addBtn d-flex gap-2 align-items-center" onClick={() => openModal(6000)}>
                <FontAwesomeIcon icon={faPlus} />
                New Project
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
