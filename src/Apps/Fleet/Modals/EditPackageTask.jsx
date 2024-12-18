import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { useSpecialties, useTaskTypes, useAircraftZones, buildTree, useInsert, formCheck } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { useUpdate, useDelete, useGetData, reOrderTasks } from "@/customHooks";
import { ProjectsContext } from "../../Projects/ProjectContext";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import CommentsTree from "../../Projects/Components/CommentTree";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select'
import Modal from "../../Warehouse/UI/Modals/Modal";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from "react-bootstrap";
import { $LoaderIndex } from "../../../store";

export default function EditPackageTask() {
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { closeModal, openModal4, refresh, refreshIndex } = useContext(HomeContext);
    const { setSpecialty_id, selectedZones, setSelectedZones, removeSelectedZone, removeSelectedDesignator, openPackage_id, selectedDesignators, setSelectedDesignators, taskToEdit } = useContext(FleetContext);
    const { openedProject } = useContext(ProjectsContext);

    const new_task_name = useRef();
    const new_task_duration = useRef();
    const new_type_id = useRef();
    const new_speciality_id = useRef();
    const new_content = useRef();

    const [specialties, setSpecialties] = useState([]);
    const [aircraftZones, setAircraftZones] = useState([]);
    const [taskTypes, setTaskTypes] = useState([]);
    const [packageInfo, setPackageInfo] = useState({ package_name: "" });
    const [taskInfo, setTaskInfo] = useState({ task_name: "" });
    const [editIndex, setEditIndex] = useState(true);
    const [comments, setComments] = useState([1]);

    function areArraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        return arr1.every((obj, index) => JSON.stringify(obj) === JSON.stringify(arr2[index]));
    }

    const handleChange = (isSpecialty) => {
        if (isSpecialty == 1) {
            if (event.target.value > 1000) {
                openModal4(5000);
            }
            else {
                setSpecialty_id(event.target.value);
                useTaskTypes(serverUrl, token, event.target.value).then((res) => {
                    setTaskTypes(res);
                    new_type_id.current.value = -1
                });
            }
        }
        else if (isSpecialty == 0) {
            if (event.target.value > 1000) {
                openModal4(+event.target.value);
                event.target.value = 0;
            }
        }
    }

    const handleRemove = async () => {
        Swal.fire({
            icon: "question",
            html: `
                <div className="d-flex flex-wrap gap-3">
                    <p className="text-danger">Are you sure you want to remove this task from the workpackage ?</p>
                    <ul className="text-start fs-6">
                        <li>This Will Affect All Related Projects Progress</li>
                        <li>This Will Affect Workpackage Progress</li>
                        <li>This Will Remove All Task Comments</li>
                    </ul>
                </div>
            `,
            showConfirmButton: true,
            showDenyButton: true,
            confirmButtonText: "Yes , Remove it",
            denyButtonText: "Not Now !"
        }).then((res) => {
            if (res.isConfirmed) {
                axios.post(`${serverUrl}/php/index.php/api/workpackage/tasks/delete`,
                    { "task_id": taskToEdit },
                    { headers: { Authorization: `Bearer ${token}` } }
                ).then((res) => {
                    Swal.fire({
                        icon: "success",
                        text: "Task Removed Succesfully",
                        timer: 1500
                    }).then(() => {
                        closeModal();
                    })
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }

    const saveChanges = async (event) => {
        setLoaderIndex(1);
        event.preventDefault();
        setEditIndex(false);
        let taskName = new_task_name.current.value;
        let taskDuration = new_task_duration.current.value;
        let specialtyId = new_speciality_id.current.value;
        let taskTypeId = new_type_id.current.props.value.value || -1;

        const obj = {
            // "package_id": openPackage_id,
            "task_name": taskName,
            "task_duration": taskDuration,
            "specialty_id": specialtyId,
            "task_type_id": taskTypeId,
        };

        let data = [
            { value: taskName, options: { required: true } },
            { value: taskDuration, options: { required: true } },
            { value: specialtyId, options: { notEqual: -1 } },
            { value: taskTypeId, options: { notEqual: -1 } },
        ];

        let hasErrors = formCheck(data);
        if (hasErrors != 0) {
            Swal.fire({
                icon: "error",
                text: "Please fill required data !",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
            setLoaderIndex(0)
        } else {
            try {
                const task_id = taskInfo.task_id;
                useUpdate(serverUrl, token, "work_package_tasks", `task_id = ${task_id}`, obj).then(() => {
                    useDelete(serverUrl, token, "tasks_x_zones", `task_id = ${task_id}`).then(() => {
                        useDelete(serverUrl, token, "tasks_x_designators", `task_id = ${task_id}`).then(async () => {
                            const zonesInsertPromises = selectedZones.map(
                                (zone, index) => {
                                    let zone_id = zone.zone_id;
                                    useInsert(serverUrl, token, "tasks_x_zones", { task_id, zone_id })
                                }
                            );

                            const designatorsPromises = selectedDesignators.map((el) => {
                                let designator_id = el.designator_id;
                                useInsert(serverUrl, token, "tasks_x_designators", { task_id, designator_id })
                            }
                            );

                            await Promise.all(zonesInsertPromises);
                            await Promise.all(designatorsPromises);

                            Swal.fire({
                                icon: "success",
                                text: "Task Updated Succssefully!",
                                customClass: darkSwal,
                                timer: 1500,
                                showConfirmButton: false,
                            }).then(() => {
                                setLoaderIndex(0);
                            });
                        });
                    })
                }).then(() => {
                    reOrderTasks(serverUrl, token, openPackage_id);
                })
            } catch (error) {
                console.log(error);
            }
        }
    };

    const addComment = (event) => {
        event.preventDefault();
        let hasErrors = formCheck([{ value: new_content.current.value, options: { required: true } }
        ])
        if (hasErrors == 0) {
            useGetData(serverUrl, token, `SELECT log_id FROM project_tasks WHERE task_id = ${taskToEdit} AND project_id = ${openedProject}`).then((res) => {
                let log_id = res[0].log_id;
                let obj = {
                    log_id: log_id,
                    comment_content: new_content.current.value,
                };
                useInsert(serverUrl, token, "task_comments", obj).then((res) => {
                    new_content.current.value = "";
                    Swal.fire({
                        icon: "success",
                        text: "Comment Added Successfully",
                        timer: 1200,
                    }).then(() => {
                        refresh();
                    })
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Fill Comment Content First",
                timer: 1200
            })
        }

    }

    const getPackageData = async () => {
        let final = {};
        await axios.get(`${serverUrl}/php/index.php/api/packages/${openPackage_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            final = res.data.data.info;
        }).catch(err => { })
        return final;
    }

    const getTaskInfo = async () => {
        let final = {};
        await axios.get(`${serverUrl}/php/index.php/api/workpackage/tasks/${taskToEdit}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            final = res.data.data[0];
        }).catch((err) => { console.log(err) });
        return final;
    }

    useEffect(() => {
        useGetData(serverUrl, token,
            `SELECT * FROM task_comments 
            WHERE log_id = (SELECT log_id FROM project_tasks WHERE task_id = ${taskToEdit} AND project_id = ${openedProject})
            ORDER BY created_at DESC
            `
        ).then((res) => {
            setComments(buildTree(res, "comment_id"))
        })
        new_speciality_id && new_speciality_id.current.value && useTaskTypes(serverUrl, token, new_speciality_id.current.value).then((res2) => {
            if (!areArraysEqual(res2, taskTypes)) {
                setTaskTypes(res2);
                let obj = res2[res2.length - 1];
                setTimeout(() => {
                    let test = { value: obj.type_id, label: obj.type_name };
                    new_type_id.current.selectOption(test);
                }, 100);
            }
        })


    }, [refreshIndex])

    useEffect(() => {
        useSpecialties(serverUrl, token).then((result) => {
            setSpecialties(result);
            getTaskInfo().then((res) => {
                setTaskInfo(res);
                setSelectedZones(res['selected_zones']);
                setSelectedDesignators(res['selected_designators']);
                new_task_name.current.value = res.task_name;
                new_task_duration.current.value = res.task_duration;
                new_speciality_id.current.value = res.specialty_id;
                setSpecialty_id(res.specialty_id);
                useTaskTypes(serverUrl, token, res.specialty_id).then((res2) => {
                    setTaskTypes(res2);
                    let obj = res2.find(el => el.type_id == res.task_type_id);
                    setTimeout(() => {
                        let test = { value: obj.type_id, label: obj.type_name };
                        new_type_id.current.selectOption(test);
                    }, 100);
                })
            });
        })
        getPackageData().then((res) => {
            setPackageInfo(res);
            useAircraftZones(serverUrl, token, res.model_id).then((res) => {
                setAircraftZones(buildTree(res, "zone_id"));
            });
        });
        return () => {
            setSelectedZones([]);
        }
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
                                        <textarea ref={new_content} className="form-control" rows={1}></textarea>
                                        <button className="btn addBtn">Add</button>
                                    </form>
                                </div>
                                <CommentsTree data={comments} />
                            </AccordionBody>
                        </AccordionItem>
                    )
                }
                <AccordionItem eventKey="1" className="col-12">
                    <AccordionHeader>
                        <h5>Task Info</h5>
                    </AccordionHeader>
                    <AccordionBody>
                        <div className="d-flex align-items-center gap-3 justify-content-end">
                            <FontAwesomeIcon icon={faTrash} className="btn btn-danger" onClick={handleRemove} />
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
                                <input className="col-12 form-control" type="text" id="sn" ref={new_task_name} placeholder="Enter New Task Name" disabled={!editIndex} required />
                            </div>
                            <div className="col-12 col-lg-5 inputField">
                                <label className="col-12" htmlFor="rn">Task Duration <span className="text-danger">*</span></label>
                                <input className="col-12 form-control" type="text" id="rn" ref={new_task_duration} placeholder="Enter Task Duration" disabled={!editIndex} required />
                            </div>
                            <div className="col-12 col-lg-5 inputField">
                                <label className="col-12" htmlFor="sn">Specialty <span className="text-danger">*</span></label>
                                <select ref={new_speciality_id} className="col-12 form-select" onChange={() => handleChange(1)} disabled={!editIndex} required>
                                    <option hidden value={-1} >Select Specialty</option>
                                    {
                                        specialties.map((el, index) => {
                                            return (<option value={el.specialty_id} key={index}>{el.specialty_name}</option>)
                                        })
                                    }
                                    <option value={5000} className="btn addBtn py-2">Add New Specialty</option>
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
                                    ref={new_type_id}
                                    className="col-12"
                                    options={taskTypes.map(el => { return { value: el.type_id, label: el.type_name } })}
                                    isDisabled={!editIndex}
                                />
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
        </Modal>
    )
}