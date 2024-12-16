import { useContext, useEffect, useState } from "react"
import { ProjectsContext } from "../ProjectContext";
import { useRecoilState } from "recoil";
import { $Server, $Token } from "@/store";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import axios from "axios";
import ProjectTasks from "../Tabs/ProjectTasks";
import ProjectDashboard from "../Tabs/ProjectDashboard";
import FullModal from "../../Warehouse/UI/Modals/FullModal";
import NavTabs from "../../Warehouse/UI/Components/NavTabs";

export default function ProjectView() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const { refreshIndex } = useContext(HomeContext);
    const { openedProject } = useContext(ProjectsContext);
    const [projectInfo, setProjectInfo] = useState({ project_name: "" });
    const getProjectData = async () => {
        let final = [];
        await axios.get(`${serverUrl}/php/index.php/api/projects/${openedProject}`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => { if (res.data.data) { final = [...res.data.data] } })
            .catch((err) => { console.log(err); })
        return final;
    }
    useEffect(() => {
        getProjectData().then(Res => {
            let project_Info = Res[0];
            setProjectInfo(project_Info);
        });
    }, [refreshIndex]);

    return (
        <FullModal name={projectInfo.project_name}>
            <FullModal.Content>
                <NavTabs>
                    <NavTabs.Tab name="Tasks"><ProjectTasks /></NavTabs.Tab>
                    <NavTabs.Tab name="Overview"><ProjectDashboard /></NavTabs.Tab>
                </NavTabs>
            </FullModal.Content>
        </FullModal>
    )
}