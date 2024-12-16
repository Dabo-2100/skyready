import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useManufacturers } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";

export default function NewManufacturer() {
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    const { closeModal } = useContext(HomeContext);
    const [manufacturers, setManufacturers] = useState([]);
    const new_manufact_name = useRef();
    useEffect(() => {
        useManufacturers(serverUrl, token).then((res) => { setManufacturers(res) })
    },
        [])
    const handleSubmit = () => {
        event.preventDefault();
        let obj = {
            manufacturer_name: new_manufact_name.current.value,
        }
        new_manufact_name.current.value = "";
        axios.post(`${serverUrl}/php/index.php/api/manufacturers/store`, obj,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((res) => {
            if (!res.data.err) {
                Swal.fire({
                    icon: "success",
                    text: "New Manufacturer Added Success !",
                    customClass: darkSwal,
                    timer: 1500,
                    showConfirmButton: false,
                }).then(() => {
                    setManufacturers(res.data.data);
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
    const handleDelete = (manu_id) => {
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to delete this Manufacturer ?",
            confirmButtonColor: "red",
            confirmButtonText: "Yes, Delete",
            showDenyButton: true,
            denyButtonColor: "green",
            denyButtonText: " No, Keep it",
            customClass: darkSwal
        }).then((res) => {
            if (res.isConfirmed) {
                let obj = {
                    manufacturer_id: manu_id,
                }
                new_manufact_name.current.value = "";
                axios.post(`${serverUrl}/php/index.php/api/manufacturers/delete`, obj,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ).then((res) => {
                    if (!res.data.err) {
                        Swal.fire({
                            icon: "success",
                            text: "Manufacturer Deleted Success !",
                            customClass: darkSwal,
                            timer: 1500,
                            showConfirmButton: false,
                        }).then(() => {
                            setManufacturers(res.data.data);
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

    return (
        <div className="modal">
            <div className="content animate__animated animate__fadeIn" onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button type="button" className="backButton" onClick={() => { closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <header className="col-12 p-0 pb-2 px-3 d-flex align-content-center justify-content-between">
                    <h1 className="fs-5">Add new Manufacturer</h1>
                </header>
                <main className="col-12 d-flex flex-wrap">
                    <form className="col-12 d-flex flex-wrap gap-3" onSubmit={handleSubmit}>
                        <div className="col-12 inputField">
                            <label className="col-12 col-lg-5" htmlFor="mn">Manufacturer Name</label>
                            <div className="col-12 d-flex gap-4">
                                <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={new_manufact_name} placeholder="Enter manufacturer name" />
                                <button className="saveButton">
                                    <div className="svg-wrapper-1"><div className="svg-wrapper"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="icon"><path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"></path></svg></div></div>
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </main>
                <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                    <p className="col-12">Manufacturers list</p>
                    <table className="table table-bordered table-dark text-center">
                        <thead>
                            <tr>
                                <th>-</th>
                                <th>Status Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                manufacturers.map((el, index) => {
                                    return (
                                        <tr key={el.manufacturer_id}>
                                            <td>{index + 1}</td>
                                            <td>{el.manufacturer_name}</td>
                                            <td>
                                                <FontAwesomeIcon icon={faX} onClick={() => handleDelete(el.manufacturer_id)} className="removeManu btn btn-danger" />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </footer>
            </div>
        </div>
    )
}