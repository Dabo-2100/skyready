import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useWorkPackages, useWorkPackageTypes, formCheck } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function NewPackage() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { closeModal, refresh, openModal } = useContext(HomeContext);
    const { parent_id, activePackageType } = useContext(FleetContext);
    const [activeType, setActiveType] = useState(0);
    const [packgeTypes, setPackgeTypes] = useState([{ package_type_name: "null" }]);
    const [packages, setPackages] = useState([]);
    const [is_folder, setIs_Folderolder] = useState(false);
    const new_package_name = useRef();

    const handleSubmit = () => {
        event.preventDefault();
        let obj = {
            "package_name": new_package_name.current.value,
            "package_type_id": activePackageType,
            "is_folder": 1,
            "parent_id": parent_id
        }

        let hasError = formCheck([
            { value: new_package_name.current.value, options: { required: true } }
        ]);

        if (hasError == 0) {
            axios.post(`${serverUrl}/php/index.php/api/packages/store`, obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((res) => {
                if (!res.data.err) {
                    Swal.fire({
                        icon: "success",
                        text: "New Model Added Success !",
                        customClass: darkSwal,
                        timer: 1500,
                        showConfirmButton: false,
                    }).then(() => {
                        setPackages(res.data.data);
                        refresh();
                    })
                }
                else {
                    Swal.fire({
                        icon: "error",
                        text: res.data.msg.errorInfo[2],
                        customClass: darkSwal,
                        // timer: 1500,
                        // showConfirmButton: false,
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Enter The New Package Name",
                customClass: darkSwal,
                timer: 1500,
                showConfirmButton: false,
            })
        }

        new_package_name.current.value = "";
    }

    const handleDelete = (package_id) => {
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this Model ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            if (res.isConfirmed) {
                let obj = {
                    package_id: package_id,
                }
                axios.post(`${serverUrl}/php/index.php/api/packages/delete`, obj,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ).then((res) => {
                    if (!res.data.err) {
                        Swal.fire({
                            icon: "success",
                            text: "Model Deleted Success !",
                            customClass: darkSwal,
                            timer: 1500,
                            showConfirmButton: false,
                        }).then(() => {
                            setPackages(res.data.data);
                            refresh();
                            // refresh();
                        })
                    }
                    else {
                        Swal.fire({
                            icon: "error",
                            text: res.data.msg.errorInfo[2],
                            customClass: darkSwal,
                            // timer: 1500,
                            // showConfirmButton: false,
                        })
                    }
                }).catch((err) => {
                    console.log(err);
                })
            }
        })
    }

    useEffect(() => {
        useWorkPackageTypes(serverUrl, token).then((res) => {
            setPackgeTypes(res);
            setActiveType(res.findIndex((el) => { return el.package_type_id == activePackageType }));
        });
        useWorkPackages(serverUrl, token, activePackageType).then((res) => {
            setPackages(res);
        })
    }, [])

    return (
        <div className="modal">
            <div className={`animate__animated animate__fadeIn content`} onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button className="backButton" onClick={() => { closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>

                <header className="col-12 p-0 pb-2 px-3 d-flex align-content-center justify-content-between">
                    <h1 className="fs-5">Add New {packgeTypes[activeType]['package_type_name']}</h1>
                </header>

                <main className="col-12 d-flex flex-wrap justify-content-center gap-2">
                    <button className="fileButton col-5" onClick={() => { setIs_Folderolder(!is_folder) }}>
                        <svg className="svg-icon" width="24" viewBox="0 0 24 24" height="24" fill="none"><g strokeWidth="2" strokeLinecap="round" stroke="#056dfa" fillRule="evenodd" clipRule="evenodd"><path d="m3 7h17c.5523 0 1 .44772 1 1v11c0 .5523-.4477 1-1 1h-16c-.55228 0-1-.4477-1-1z"></path><path d="m3 4.5c0-.27614.22386-.5.5-.5h6.29289c.13261 0 .25981.05268.35351.14645l2.8536 2.85355h-10z"></path></g></svg>
                        <span className="lable">Folder Package</span>
                    </button>

                    <button className="fileButton col-5" onClick={() => openModal(4001)}>
                        <svg aria-hidden="true" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path strokeWidth="2" stroke="#fffffff" d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" strokeLinejoin="round" strokeLinecap="round"></path>
                            <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" stroke="#fffffff" d="M17 15V18M17 21V18M17 18H14M17 18H20"></path>
                        </svg>
                        <span className="lable">Detailed Package</span>
                    </button>
                    {
                        is_folder && (
                            <form className="col-12 d-flex flex-wrap border-top pt-3 mt-2" onSubmit={handleSubmit}>
                                <div className="col-12 inputField">
                                    <label className="col-12 col-lg-5" htmlFor="mn">Package Name</label>
                                    <div className="col-12 d-flex gap-4 justify-content-between">
                                        <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_package_name} placeholder="Enter New Type name" />
                                        <button className="saveButton">
                                            <div className="svg-wrapper-1">
                                                <div className="svg-wrapper">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon">
                                                        <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )
                    }

                </main>
                {
                    packages.length > 0 && (<footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                        <p className="col-12 fs-5 fw-medium">{packgeTypes[activeType]['package_type_name']} list</p>
                        <table className="table table-bordered table-dark text-center">
                            <thead>
                                <tr>
                                    <th>-</th>
                                    <th>{packgeTypes[activeType]['package_type_name']} Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {packages.map((el, index) => {
                                    if (el.parent_id == parent_id && el.package_type_id == activePackageType) {
                                        return (

                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{el.package_name}</td>
                                                <td><FontAwesomeIcon icon={faX} onClick={() => handleDelete(el.package_id)} className="removeManu btn btn-danger" /></td>
                                            </tr>
                                        )

                                    }
                                })}

                            </tbody>
                        </table>
                    </footer>)
                }

            </div>
        </div>
    )
}