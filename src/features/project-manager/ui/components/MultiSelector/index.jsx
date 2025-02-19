import { IoCloseCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import Status from "../Status";
import { resetSelector } from "../../../state/multiTasksSelectorSlice";
export default function MultiSelector() {
    const dispatch = useDispatch();
    const multiSelect = useSelector(state => state.projects.multiTasksSelector);
    return (
        <div className={styles.multiSelector + " col-10 col-md-4 bg-white d-flex flex-column gap-3 p-3 rounded-3 shadow animate__animated animate__fadeInDown"}>
            <div className="col-12 d-flex align-items-center justify-content-between">
                <h5 className="text-dark">Change Multi Task Status</h5>
                <IoCloseCircleSharp onClick={() => dispatch(resetSelector())} className="text-danger fs-3" />
            </div>
            <p className="m-0 text-success">Selected Tasks : {multiSelect.tasks.length}</p>
            <div className="col-12">
                <Status isMulti={true} status_name="Change Status" status_id="-1" />
            </div>
        </div>
    )
}
