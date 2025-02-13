import React, { useEffect, useRef, useState } from 'react'
import useAircraft from '../hooks/useAircraft';
import Swal from 'sweetalert2';
import PrintBtn from '../../../../shared/ui/components/PrintBtn';

export default function ConnectorFinder() {
    const tasksTable = useRef();
    const [designatorName, setDesignatorName] = useState();
    const [designators, setDesignators] = useState([]);
    const [designatorTasks, setDesignatorTasks] = useState([]);
    const { getDesignatorTasks, getAircraftDesignators } = useAircraft();

    const handleSearch = (e) => {
        e.preventDefault();
        let designator = designators.find((el) => el.designator_name === designatorName);
        if (designator) {
            let designatorId = designator.designator_id;
            getDesignatorTasks(designatorId).then((res) => {
                res.length == 0 && Swal.fire({
                    icon: "info",
                    title: "No Tasks",
                    text: "There are no tasks related to this designator",
                    timer: 1200
                });
                setDesignatorTasks(res);
            });
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Designator not found',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    useEffect(() => { getAircraftDesignators().then(setDesignators) }, []);

    return (
        <div className="col-12 p-3 Tab" id="connectorFinder">
            <form noValidate className='col-12 d-flex gap-3' onSubmit={handleSearch}>
                <datalist id='designators'>
                    {
                        designators.map((el) => {
                            return (
                                <option key={el.designator_id} value={el.designator_name} />
                            )
                        })
                    }
                </datalist>
                <input list='designators' onChange={(e) => setDesignatorName(e.target.value)} className='form-control' type='serach' placeholder='Enter Connector Name' />

                <button className='btn addBtn col-2'>Find</button>
            </form>
            {
                designatorTasks.length > 0 &&
                <div className='col-12 mt-3 d-flex flex-column'>
                    <PrintBtn contentRef={tasksTable} />
                    <table ref={tasksTable} className='table table-dark table-bordered text-center animate__animated animate__fadeInUp '>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Package Name</th>
                                <th>Package Part</th>
                                <th>Task Name</th>
                                <th>Task Desc</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                designatorTasks.map((task, index) => {
                                    console.log(task);
                                    return (
                                        <tr key={task.task_id}>
                                            <td>{index + 1}</td>
                                            <td>{task.parent_package_name}</td>
                                            <td>{task.package_name}</td>
                                            <td>{task.task_name}</td>
                                            <td>{task.task_desc}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}
