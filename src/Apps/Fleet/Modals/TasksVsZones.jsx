import { useContext } from 'react'
import Modal from '../../Warehouse/UI/Modals/Modal'
import { ProjectsContext } from '../../Projects/ProjectContext'
export default function TasksVsZones(props) {
    const { tasksInZones } = useContext(ProjectsContext)
    return (
        <Modal>
            <h5 className='col-12 text-center'>Tasks in zones : [{props.zones} ]</h5>
            <table className='col-12 table table-dark table-bordered text-center'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Work Package</th>
                        <th>Zone</th>
                        <th>Task Name</th>
                        <th>Task Type</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tasksInZones.map((el, index) => {
                            return (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <th>Work Package</th>
                                    <th>Zone</th>
                                    <th>Task Name</th>
                                    <th>Task Type</th>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </Modal>
    )
}
