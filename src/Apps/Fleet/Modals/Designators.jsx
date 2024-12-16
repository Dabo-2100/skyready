import { useContext, useEffect, useRef, useState } from "react"
import { FleetContext } from "../FleetContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useDesignatorTypes, useAircraftDesignators, buildTree } from "@/customHooks";
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import NoImg from '@/assets/offline.png'
import axios from "axios";
import Swal from "sweetalert2";
import TreeView from "../Components/Tree";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";
import Modal from "../../Warehouse/UI/Modals/Modal";

export default function Designators() {
    // ====> Recoil States
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    // ====> Context States 
    const { closeModal } = useContext(HomeContext);
    const { openPackage_id, selectedDesignators, setSelectedDesignators, setZoneParent } = useContext(FleetContext);
    // ====> Component States 
    const [packageInfo, setPackageInfo] = useState([]);
    const [designatorTypes, setDesignatorTypes] = useState([]);
    const [designators, setDesignators] = useState([]);
    // ====> Refs
    const designator_name = useRef();
    const new_type_id = useRef();
    // ====> Functions
    const getPackageData = async () => {
        let final = {};
        await axios.get(`${serverUrl}/php/index.php/api/packages/${openPackage_id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            final = res.data.data.info;
        }).catch(err => console.log(err))
        return final;
    }

    const showAll = () => {
        useAircraftDesignators(serverUrl, token, packageInfo.model_id).then((res) => {
            console.log(res)
            setDesignators(res);
        });
    }

    const handleSearch = () => {
        setDesignators([]);
        let obj = {
            filter_by: "designator_name",
            filter_val: designator_name.current.value
        }
        if (designator_name.current.value) {
            axios.post(`${serverUrl}/php/index.php/api/aircraft/designators/search`, obj,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ).then((res) => {
                if (!res.data.err) {

                    setDesignators(res.data.data);
                }
                else {
                    Swal.fire({
                        icon: "error",
                        text: res.data.msg.errorInfo[2],
                        customClass: darkSwal,
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "Please Enter Zone Name",
                timer: 1500,
                customClass: darkSwal,
            })
        }
    }

    const handleAdd = () => {
        let obj = {
            "model_id": packageInfo.model_id,
            "designator_name": designator_name.current.value,
            "type_id": new_type_id.current.value
        }
        axios.post(`${serverUrl}/php/index.php/api/aircraft/designators/store`, obj,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then((res) => {
            if (!res.data.err) {
                Swal.fire({
                    icon: "success",
                    text: "Designator Added Successfully To Aircraft Model",
                    customClass: darkSwal,
                    timer: 1500,
                }).then(() => {
                    handleSearch();
                })
            }
            else {
                Swal.fire({
                    icon: "error",
                    text: res.data.msg.errorInfo[2],
                    customClass: darkSwal,
                })
            }
        }).catch((err) => {
            console.log(err);
        })

    }

    const toggleDesignator = (designator_id, designator_name) => {
        let designator_obj = {
            designator_id: designator_id,
            designator_name: designator_name
        }

        let isHere = selectedDesignators.findIndex((el, index) => {
            return el.designator_id == designator_id;
        });

        let Orignal = [...selectedDesignators];
        isHere == -1 ? Orignal.push(designator_obj) : Orignal.splice(isHere, 1);
        setSelectedDesignators(Orignal);
    }
    // ====> Side Effects
    useEffect(() => {
        useDesignatorTypes(serverUrl, token).then((res) => {
            setDesignatorTypes(res);
        });
        getPackageData().then((res) => {
            setPackageInfo(res);
        });
    }, [])
    // ====> Watchers
    return (
        <Modal>
            <main className="col-12 d-flex flex-wrap">
                <form className="col-12 d-flex flex-wrap gap-3" onSubmit={(event) => { event.preventDefault(); handleSearch() }}>
                    <div className="col-12 inputField">
                        <label className="col-12 col-lg-5" htmlFor="mn">Search By Designator Name</label>
                        <div className="col-12 d-flex gap-4">
                            <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={designator_name} placeholder="Enter zone name" />
                            <button className="btn btn-primary" type="button" onClick={showAll}>Show All</button>
                            <button className="btn btn-success text-success bg-success-subtle flex-grow-1 ">Search</button>
                        </div>
                    </div>
                </form>
                <div className="col-12 d-flex flex-wrap gap-3 py-2">
                    <p>Selected Designators</p>
                    <div className="col-12 d-flex flex-wrap">
                        {
                            selectedDesignators.map((el, index) => {
                                return (
                                    <button key={el.designator_id} className="btn btn-primary d-flex gap-3 align-items-center">
                                        {el.designator_name}
                                        <FontAwesomeIcon icon={faX} onClick={(() => { toggleDesignator(el.designator_id, el.designator_name); setDesignators([]); designator_name.current.value = null })} />
                                    </button>
                                )
                            })
                        }

                    </div>
                </div>
            </main>
            {
                designators.length > 0 ?
                    (
                        <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>-</th>
                                        <th>Designator Name</th>
                                        <th>Designator Type</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        designators.map((el, index) => {
                                            console.log(el);
                                            return (
                                                <tr key={el.designator_id}>
                                                    <td>
                                                        <div className="cntr">
                                                            <input
                                                                defaultChecked={
                                                                    selectedDesignators.findIndex((designator, index) => {
                                                                        return designator.designator_id == el.designator_id;
                                                                    }) == -1 ? false : true
                                                                }
                                                                onChange={() => toggleDesignator(el.designator_id, el.designator_name)}
                                                                id={`zone_${el.designator_id}`} type="checkbox" className="hidden-xs-up input" />
                                                            <label htmlFor={`zone_${el.designator_id}`} className="cbx"></label>
                                                        </div>
                                                    </td>
                                                    <td>{el.designator_name}</td>
                                                    <td>
                                                        <select className="form-select" defaultValue={el.type_id}>
                                                            {
                                                                designatorTypes.map((type) => {
                                                                    return <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </td>
                                                    <td><button className="btn btn-danger">remove</button></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </footer>
                    ) : (
                        designator_name.current && designator_name.current.value && (
                            <div className="col-12 gap-3 jusify-self-center d-flex flex-column align-items-center p-3">
                                <img height={100} src={NoImg} />
                                <h6 className="text-center col-12">This Designator [ {designator_name.current.value} ] is Not Register to this Aircraft Model</h6>
                                <div className="col-12 d-flex flex-wrap gap-2">
                                    <div className="d-flex col-12 gap-3 align-items-center justify-content-center">
                                        <label >Select Designator Type : </label>
                                        <div className="d-flex">
                                            <select className="form-select flex-grow-0" ref={new_type_id}>
                                                {
                                                    designatorTypes.map((type, index) => {
                                                        return <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <button className="btn addBtn" onClick={handleAdd}>Add Desingator</button>
                                    </div>
                                </div>

                            </div>
                        )
                    )
            }
        </Modal>
        // <div className="modal">
        //     <div className="content animate__animated animate__fadeIn d-flex flex-wrap justify-content-center" onClick={(event) => { event.stopPropagation() }}>
        //         <div className="col-12">
        //             <button className="backButton" onClick={() => closeModal()}>
        //                 <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
        //                 <span>Back</span>
        //             </button>
        //         </div>

        //         {/* <header className="col-12 d-flex align-content-center justify-content-between">
        //             <div className="d-flex align-items-center gap-3">
        //                 <h5 className="mb-0">Add Task Designators</h5>
        //             </div>
        //             <FontAwesomeIcon icon={faX} className="closeModalIcon" onClick={() => { closeModal() }} />
        //         </header> */}

        //     </div>
        // </div>
    )
}
