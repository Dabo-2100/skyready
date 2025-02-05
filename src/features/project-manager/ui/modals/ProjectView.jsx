import ProjectTasks from "../tabs/ProjectTasks";
import FullModal from "../../../../Apps/Warehouse/UI/Modals/FullModal";
import { useSelector } from "react-redux";

export default function ProjectView() {
    const activeProject = useSelector(state => state.projects.activeProject);
    return (
        <FullModal name={activeProject.info.project_name}>
            <ProjectTasks />
        </FullModal>
    )
}