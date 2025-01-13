import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../../../../Apps/Fleet/FleetContext"
import { useRecoilState } from "recoil";
import { ProjectsContext } from "../../../../Apps/Projects/ProjectContext";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import CommentsTree from "../../../../Apps/Projects/Components/CommentTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faTrash } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select'
import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-bootstrap";
import { $LoaderIndex } from "../../../../store";
import useEditPackageTask from "../../../../Hooks/useEditPackageTask";
import useWorkPackage from "../../../../Hooks/useWorkPackage";
import { useDispatch, useSelector } from "react-redux";
import usePackages from "../hooks/usePackages";
import TaskWorkingZone from "../components/TaskWorkingZone";
import TaskWorkingDesignators from "../components/TaskWorkingDesignators";
import SaveBtn from "../../../../Apps/Warehouse/UI/Components/SaveBtn";
import useAircraftData from "../hooks/useAircraftData";
import { setActiveId as setSpecialty_id } from "../../state/activeSpecialityIdSlice";
import { resetDesignators } from "../../state/selectedDesignatorsSlice";
import { resetZones } from "../../state/selectedZonesSlice";

export default function EditPackageTask() {
    const dispatch = useDispatch();
    const { getWorkPackageTaskInfo, getWorkPackageTaskTypes } = usePackages();
    const { aircraftSpecialties } = useAircraftData();
    const active_work_package_task_id = useSelector(state => state.aircraftFleet.activeWorkPackageTaskId.value);
    const { openModal4 } = useContext(HomeContext);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const { openedProject } = useContext(ProjectsContext);
    const taskInputs = useRef([]);
    const [comments, setComments] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [editIndex, setEditIndex] = useState(true);
    const [taskInfo, setTaskInfo] = useState({ task_name: "" });

    const { getComments, saveComment, updateTask, removeTask, areArraysEqual } = useEditPackageTask();

    const saveChanges = async (event) => {
        event.preventDefault();
        setLoaderIndex(true);
        setEditIndex(false);
        updateTask(taskInputs, taskInfo);
    };

    const addComment = (event) => {
        event.preventDefault();
        saveComment(taskInputs.current[5].value).then(() => { taskInputs.current[5].value = "" })
    }

    useEffect(() => {
        getWorkPackageTaskInfo(active_work_package_task_id).then((result) => {
            setTaskInfo(result);
            taskInputs.current[0].value = result.task_name;
            taskInputs.current[1].value = result.task_duration;
            taskInputs.current[2].value = result.specialty_id;
            taskInputs.current[4].value = result.task_desc;
            getWorkPackageTaskTypes(result.specialty_id).then((res) => {
                let obj = res.find(el => el.type_id == result.task_type_id);
                obj && taskInputs.current[3].selectOption({ value: obj.type_id, label: obj.type_name });
                setTaskTypes(res);
                setSpecialty_id(res.specialty_id);
            })
        });
    }, [aircraftSpecialties]);

    useEffect(() => {
        //     getComments().then(setComments);
        //     taskInputs.current[2] && taskInputs.current[2].value != -1 &&
        return () => {
            dispatch(resetDesignators());
            dispatch(resetZones());
        }
    }, [])

    return (
        <Modal>
            <Accordion className="col-12" defaultActiveKey={['1']} alwaysOpen>
                {
                    openedProject != 0 && (
                        <AccordionItem eventKey="0" className="col-12">
                            <AccordionHeader>
                                <h5>Task Comments</h5>
                            </AccordionHeader>
                            <AccordionBody>
                                <div className="col-12">
                                    <h5>Add New Comment</h5>
                                    <form onSubmit={addComment} className="col-12 d-flex p-2 pt-0 gap-3 align-items-center border-top-0">
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
                                editIndex ? (
                                    <SaveBtn label="Save" onClick={saveChanges} />
                                ) : (
                                    <button className="editButton" onClick={() => { setEditIndex(true) }}>
                                        Edit
                                        <svg viewBox="0 0 512 512" className="svg"> <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path></svg>
                                    </button>
                                )
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
                                    <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => openModal4(5000)} icon={faGears} />
                                </div>
                                <select onChange={(e) => {
                                    e.target.value != taskInfo.task_type_id && getWorkPackageTaskTypes(e.target.value).then(setTaskTypes);
                                    taskInputs.current[3].selectOption({});
                                }
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
                                        editIndex && <FontAwesomeIcon type="button" className="btn addBtn" onClick={() => openModal4(4004)} icon={faGears} />
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