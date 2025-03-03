import { useEffect } from "react";
import FullModal from "../../../../shared/ui/modals/FullModal";
import ProjectTasks from "../tabs/ProjectTasks";
import { useDispatch, useSelector } from "react-redux";
import { resetActiveProject } from "../../state/activeProjectSlice";
import { useOperators } from "../../../../store-zustand";
import Operators from "./Operators";

export default function ProjectView() {
    const dispatch = useDispatch();
    const activeProject = useSelector(state => state.projects.activeProject);
    const { index } = useOperators();
    useEffect(() => {
        return () => { dispatch(resetActiveProject()) }
        // eslint-disable-next-line
    }, []);
    return (
        <FullModal name={activeProject.info.project_name}>
            {index && <Operators />}
            <ProjectTasks />
        </FullModal>
    )
}