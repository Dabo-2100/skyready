import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import usePackages from "../hooks/usePackages";
import TaskWorkingZone from "../components/TaskWorkingZone";
import TaskWorkingDesignators from "../components/TaskWorkingDesignators";
import { setActiveId as setSpecialty_id } from "../../state/activeSpecialityIdSlice";
import { resetDesignators } from "../../state/selectedDesignatorsSlice";
import { resetZones } from "../../state/selectedZonesSlice";
import { closeModal, openModal4 } from "../../../../shared/state/modalSlice";
import Modal from "../../../../shared/ui/modals/Modal";
import SaveBtn from "../../../../shared/ui/components/SaveBtn";
import CommentsTree from "../../../../shared/ui/components/CommentTree";
import useProjects from "../../../project-manager/ui/hooks/useProjects";
import EditBtn from "../../../../shared/ui/components/EditBtn";
import { setSpecialties } from "../../state/aircraftSpecialtiesSlice";
import useAircraft from "../hooks/useAircraft";
import { buildTree } from "../../../../shared/utilities/buildTree";
import { useLoader } from "../../../../store-zustand";
// import { setActiveId as setActiveModelId } from "../../state/activeAircraftModelIdSlice";
export default function EditPackageTask() {
    const { getAircraftSpecialties } = useAircraft();
    const dispatch = useDispatch();
    const { getTaskComments, addNewComment, removeWorkPackageTask } = useProjects();
    const { getWorkPackageTaskInfo, getWorkPackageTaskTypes, updateWorkPackageTask } = usePackages();

    const aircraftSpecialties = useSelector(state => state.aircraftFleet.aircraftSpecialties.value);
    const refreshIndex = useSelector(state => state.home.refreshIndex.value);

    const selectedDesignators = useSelector(state => state.aircraftFleet.selectedDesignators.value);
    const selectedZones = useSelector(state => state.aircraftFleet.selectedZones.value);

    const activeSepcialtyId = useSelector(state => state.aircraftFleet.activeSpecialityId.value);
    const activeProjectId = useSelector(state => state.projects.activeProject.id);
    const activeTaskId = useSelector(state => state.aircraftFleet.activeWorkPackageTaskId.value);

    const { setLoaderIndex } = useLoader();

    const taskInputs = useRef([]);
    const [comments, setComments] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [editIndex, setEditIndex] = useState(true);
    const [taskInfo, setTaskInfo] = useState({ task_name: "" });

    const updateTask = () => {
        updateWorkPackageTask(taskInputs, activeTaskId, selectedZones, selectedDesignators);
    }

    const removeTask = () => {
        removeWorkPackageTask(activeTaskId).then(() => { dispatch(closeModal()) })
    }

    const saveChanges = async (event) => {
        event.preventDefault();
        setLoaderIndex(true);
        setEditIndex(false);
        updateTask(taskInputs, taskInfo);
    };

    const handleNewComment = (event) => {
        event.preventDefault();
        let commentContent = taskInputs.current[5].value;
        addNewComment(activeTaskId, activeProjectId, commentContent).then(() => {
            taskInputs.current[5].value = "";
        });
    }

    const handleChangeSpecaility = (e) => {
        if (e.target.value != taskInfo.task_type_id) {
            getWorkPackageTaskTypes(e.target.value).then(setTaskTypes).then(() => {
                dispatch(setSpecialty_id(e.target.value));
                taskInputs.current[3].selectOption({});
            });
        }
    }

    useEffect(() => {
        getWorkPackageTaskInfo(activeTaskId).then((result) => {
            const { task_name, task_duration, specialty_id, task_desc } = result;
            taskInputs.current[0].value = task_name;
            taskInputs.current[1].value = task_duration;
            taskInputs.current[2].value = specialty_id;
            taskInputs.current[4].value = task_desc;
            dispatch(setSpecialty_id(specialty_id));
            setTaskInfo(result);
        });
        return () => { dispatch(resetDesignators()); dispatch(resetZones()) }
        // eslint-disable-next-line
    }, [])


    useEffect(() => {
        getWorkPackageTaskTypes(activeSepcialtyId).then((res) => {
            let obj = res.find(el => el.type_id == taskInfo.task_type_id);
            obj && taskInputs.current[3].selectOption({ value: obj.type_id, label: obj.type_name });
            setTaskTypes(res);
        })
        // eslint-disable-next-line
    }, [taskInfo.task_type_id, refreshIndex]);

    useEffect(() => {
        getTaskComments(activeTaskId, activeProjectId).then((res) => {
            setComments(buildTree(res.current_comments, "comment_id"))
        });
        // eslint-disable-next-line
    }, [activeTaskId, refreshIndex]);

    useEffect(() => {
        getAircraftSpecialties().then((res) => { dispatch(setSpecialties(res)) });
        // eslint-disable-next-line
    }, [refreshIndex]);


    return (
        <Modal>
            <Accordion className="col-12" defaultActiveKey={['1']} alwaysOpen>
                {
                    activeProjectId != 0 && (
                        <AccordionItem eventKey="0" className="col-12">
                            <AccordionHeader>
                                <h5>Task Comments</h5>
                            </AccordionHeader>
                            <AccordionBody>
                                <div className="col-12">
                                    <h5>Add New Comment</h5>
                                    <form onSubmit={handleNewComment} className="col-12 d-flex p-2 pt-0 gap-3 align-items-center border-top-0">
                                        <textarea ref={el => { taskInputs.current[5] = el }} className="form-control" rows={1}></textarea>
                                        <button className="btn addBtn">Add</button>
                                    </form>
                                </div>
                                <CommentsTree data={comments} />
                            </AccordionBody>
                        </AccordionItem>
                    )
                }
                <AccordionItem eventKey="1" className="col-12">
                    <AccordionHeader><h5>Task Info</h5></AccordionHeader>
                    <AccordionBody>
                        <div className="d-flex align-items-center gap-3 justify-content-end">
                            <FontAwesomeIcon icon={faTrash} className="btn btn-danger" onClick={removeTask} />
                            {
                                editIndex ?
                                    <SaveBtn label="Save" onClick={saveChanges} /> :
                                    <EditBtn label="Edit" onClick={() => { setEditIndex(true) }} />
                            }
                        </div>
                        <form className="col-12 d-flex flex-wrap gap-3 justify-content-lg-between">
                            <div className="col-12 col-lg-5 inputField">
                                <label className="col-12" htmlFor="sn">Task Name <span className="text-danger">*</span></label>
                                <input className="col-12 form-control" type="text" id="sn" ref={el => { taskInputs.current[0] = el }} placeholder="Enter New Task Name" disabled={!editIndex} required />
                            </div>
                            <div className="col-12 col-lg-5 inputField">
                                <label className="col-12" htmlFor="rn">Task Duration <span className="text-danger">*</span></label>
                                <input className="col-12 form-control" type="text" id="rn" ref={el => { taskInputs.current[1] = el }} placeholder="Enter Task Duration" disabled={!editIndex} required />
                            </div>
                            <div className="col-12 col-lg-5 inputField">
                                <div className="col-12 d-flex align-items-center justify-content-between">
                                    <label htmlFor="sn">Specialty <span className="text-danger">*</span></label>
                                    <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => dispatch(openModal4(5000))} icon={faGears} />
                                </div>
                                <select onChange={(e) => { handleChangeSpecaility(e) }
                                } ref={el => { taskInputs.current[2] = el }
                                } className="col-12 form-select" disabled={!editIndex} required>
                                    <option hidden value={-1} >Select Specialty</option>
                                    {
                                        aircraftSpecialties.map((el, index) => {
                                            return (<option value={el.specialty_id} key={index}>{el.specialty_name}</option>)
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-12 col-lg-5 inputField">
                                <label className="col-12 d-flex align-items-center justify-content-between" htmlFor="sn">
                                    <div className="d-flex align-items-center gap-2">Task Type <span className="text-danger">*</span></div>
                                    {
                                        editIndex && <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => dispatch(openModal4(4004))} icon={faGears} />
                                    }
                                </label>
                                <Select
                                    ref={el => { taskInputs.current[3] = el }}
                                    className="col-12"
                                    options={taskTypes.map(el => { return { value: el.type_id, label: el.type_name } })}
                                    isDisabled={!editIndex}
                                />
                            </div>
                            <div className="col-12 col-lg-5 inputField">
                                <label htmlFor="">Task Description</label>
                                <textarea ref={el => { taskInputs.current[4] = el }} className="form-control"></textarea>
                            </div>
                            <hr className="col-12 m-0" />
                            <TaskWorkingZone />
                            <hr className="col-12" />
                            <TaskWorkingDesignators />
                        </form>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </Modal >
    )
}