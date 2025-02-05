import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { setActiveId } from "../../state/activeWorkPackageTaskIdSlice"
import { openModal3 } from "../../../../shared/state/modalSlice";

export default function TasksTable({ workPackageTasks }) {
    const dispatch = useDispatch();
    const showTask = (task_id) => {
        dispatch(setActiveId(task_id));
        dispatch(openModal3(4005));
    }

    return (
        <table className="table table-bordered table-hover text-center table-dark packageTasks">
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Task Name</th>
                    <th>Task Specialty</th>
                    <th>Task Type</th>
                    <th>Task Duration</th>
                </tr>
            </thead>
            <tbody>
                {
                    workPackageTasks.map((el, index) => {
                        return (
                            <tr key={index} onClick={() => showTask(el.task_id)}>
                                <td>{index + 1}</td>
                                <td>{el.task_name}</td>
                                <td>{el.specialty_name}</td>
                                <td>{el.task_type_name}</td>
                                <td>{el.task_duration}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

TasksTable.propTypes = {
    workPackageTasks: PropTypes.array,
};