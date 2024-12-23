import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { useRecoilState } from "recoil";
import { ProjectsContext } from "../../Projects/ProjectContext";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import CommentsTree from "../../Projects/Components/CommentTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select'
import Modal from "../../Warehouse/UI/Modals/Modal";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-bootstrap";
import { $LoaderIndex } from "../../../store";
import useEditPackageTask from "../../../Hooks/useEditPackageTask";
import useWorkPackage from "../../../Hooks/useWorkPackage";

export default function EditPackageTask() {
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const { openModal4, refreshIndex } = useContext(HomeContext);
    const { openedProject } = useContext(ProjectsContext);
    const { setSpecialty_id, selectedZones, setSelectedZones, removeSelectedZone, removeSelectedDesignator, selectedDesignators, setSelectedDesignators } = useContext(FleetContext);
    const taskInputs = useRef([]);
    const [comments, setComments] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [editIndex, setEditIndex] = useState(true);
    const [specialties, setSpecialties] = useState([]);
    const [taskInfo, setTaskInfo] = useState({ task_name: "" });
    const { specialties: wpSpecialties, taskTypes: getTaskTypes } = useWorkPackage();
    const { getComments, getTaskInfo, saveComment, updateTask, removeTask, areArraysEqual } = useEditPackageTask();

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
        getComments().then(setComments);
        taskInputs.current[2] && taskInputs.current[2].value != -1 &&
            getTaskTypes(taskInputs.current[2].value).then((res2) => {
                if (!areArraysEqual(res2, taskTypes)) {
                    setTaskTypes(res2);
                    let obj = res2[res2.length - 1];
                    setTimeout(() => {
                        let test = { value: obj.type_id, label: obj.type_name };
                        taskInputs.current[3].selectOption(test);
                    }, 100);
                }
            })
    }, [refreshIndex])

    useEffect(() => {
        wpSpecialties().then((result) => {
            setSpecialties(result);
            getTaskInfo().then((res) => {
                setTaskInfo(res);
                setSpecialty_id(res.specialty_id);
                setSelectedZones(res['selected_zones']);
                setSelectedDesignators(res['selected_designators']);
                taskInputs.current[0].value = res.task_name;
                taskInputs.current[1].value = res.task_duration;
                taskInputs.current[2].value = res.specialty_id;
                taskInputs.current[4].value = res.task_desc;
                getTaskTypes(res.specialty_id).then((res2) => {
                    setTaskTypes(res2);
                    let obj = res2.find(el => el.type_id == res.task_type_id);
                    setTimeout(() => {
                        obj && taskInputs.current[3].selectOption({ value: obj.type_id, label: obj.type_name });
                    }, 100);
                })
            })
        })
        return () => { setSelectedZones([]); setSelectedDesignators([]); }
    }, []);

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
                                    <button className="saveButton" onClick={saveChanges}>
                                        <div className="svg-wrapper-1"><div className="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path></svg></div></div>
                                        <span>Save</span>
                                    </button>
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
                                    e.target.value != taskInfo.task_type_id && getTaskTypes(e.target.value).then(setTaskTypes);
                                    taskInputs.current[3].selectOption({});
                                }
                                } ref={el => { taskInputs.current[2] = el }
                                } className="col-12 form-select" disabled={!editIndex} required>
                                    <option hidden value={-1} >Select Specialty</option>
                                    {
                                        specialties.map((el, index) => {
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
                            <div className="col-12 d-flex flex-wrap">
                                <div className="col-12 d-flex flex-wrap">
                                    <div className="col-12 d-flex align-items-center justify-content-between">
                                        <label className={!editIndex ? ('mb-2') : null}>Working Zones</label>
                                        {
                                            editIndex && (
                                                <button className="addMoreButton" type="button" onClick={() => openModal4(1006)}>
                                                    <div className="sign">+</div>
                                                    <div className="text">Add Zone</div>
                                                </button>
                                            )
                                        }
                                    </div>
                                    <div className="col-12 d-flex gap-2 flex-wrap">
                                        {
                                            (selectedZones.length > 0) && (selectedZones.map((zone, index) => {
                                                return (
                                                    <button type="button" className="btn d-flex align-items-center gap-2 addBtn" key={zone.zone_id} >
                                                        <p>{zone.zone_name}</p>
                                                        {
                                                            editIndex && <FontAwesomeIcon onClick={() => removeSelectedZone(zone.zone_id)} icon={faX} />
                                                        }
                                                    </button>
                                                )
                                            })
                                            )
                                        }
                                    </div>
                                </div>
                                <hr className="col-12" />
                                <div className="col-12 d-flex flex-wrap">
                                    <div className="col-12 d-flex align-items-center justify-content-between">
                                        <label className={!editIndex ? ('mb-2') : null}>Task Designators</label>
                                        {
                                            editIndex && (<button type="button" className="addMoreButton" onClick={() => openModal4(1007)}>
                                                <div className="sign">+</div>
                                                <div className="text">Add Designator</div>
                                            </button>)
                                        }
                                    </div>
                                    <div className="col-12 d-flex flex-wrap gap-3">
                                        {(selectedDesignators.length > 0) && (selectedDesignators.map((el, index) => {
                                            return (
                                                <button type="button" className="btn addBtn d-flex align-items-center gap-3" key={index}>
                                                    <p>{el.designator_name}</p>
                                                    {
                                                        editIndex && <FontAwesomeIcon icon={faX} onClick={() => removeSelectedDesignator(el.designator_id)} />
                                                    }
                                                </button>
                                            )
                                        })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </Modal >
    )
}