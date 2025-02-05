import FullModal from "../../../../shared/ui/modals/FullModal";
import ProjectTasks from "../tabs/ProjectTasks";
import { useSelector } from "react-redux";

export default function ProjectView() {
    const activeProject = useSelector(state => state.projects.activeProject);
    return (
        <FullModal name={activeProject.info.project_name}>
            <ProjectTasks />
        </FullModal>
    )
}