import React, { useContext, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { ReportContext } from "../ReportContext";
import { useGetData } from "../../../customHooks";

export default function Detailed_WP() {
    // ==================================================>
    const { activeWP, setModalIndex } = useContext(ReportContext)
    // ==================================================>
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    // ==================================================>
    const [subPackageDetails, setSubPackageDetails] = useState([]);
    // ==================================================>
    const getWPData = () => {
        let children = activeWP.children.map(el => el.package_id);
        axios.post(`${serverUrl}/php/index.php/api/report/wp/details`, {
            package_children: children,
        }, { headers: { Authorization: `Bearer ${token}` } }).then((res) => {
            setSubPackageDetails(res.data.data);
        })
        // let parent_id = activeWP.parent_id;
    }
    const specialties = (id) => {
        let final = [];
        if (subPackageDetails.length > 0) {
            let x = subPackageDetails.find(sub => sub.package_id == id);
            final = x.specialites
        }
        return final
    }
    // ==================================================>
    useEffect(() => {
        getWPData();
    }, [])
    return (
        <div className="modal" id="Detailed_WP">
            <div className="content text-dark container animate__animated animate__fadeIn" onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button className="backButton" onClick={() => { setModalIndex(false) }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <main className="col-12 d-flex flex-wrap p-2">
                    <h4 className="col-12">Work Package Info</h4>
                    <div className="col-12 d-flex flex-wrap border">
                        <p className="col-6 p-2 text-center">Work Package Name </p>
                        <p className="col-6 p-2 text-center border-start fw-bold">{activeWP.parent_name}</p>
                    </div>
                    <div className="col-12 d-flex flex-wrap border">
                        <p className="col-6 p-2 text-center">Issued Duration </p>
                        <p className="col-6 p-2 text-center border-start fw-bold">{(activeWP.parent_issued_duration && activeWP.parent_issued_duration.toFixed()) || 0} HRS </p>
                    </div>
                    <div className="col-12 d-flex flex-wrap border">
                        <p className="col-6 p-2 text-center">Estimated Duration </p>
                        <p className="col-6 p-2 text-center border-start fw-bold">{activeWP.parent_package_duration && activeWP.parent_package_duration.toFixed() || 0} HRS </p>
                    </div>
                    <div className="col-12 d-flex flex-wrap border">
                        <p className="col-6 p-2 text-center">Work Package Progress </p>
                        <p className="col-6 p-2 text-center border-start fw-bold">{activeWP.done_parent_progress} % </p>
                    </div>
                </main>
                <hr className="col-12" />
                <section className="col-12 p-2">
                    <h4 className="col-12">Sub Work Packages</h4>
                    {
                        activeWP.children.map((el, index) => {
                            return (
                                <div key={el.package_id} className="col-12 d-flex flex-wrap border mb-2">
                                    <div className="col-12 d-flex flex-wrap border">
                                        <p className="col-6 bg-dark text-white p-2 text-center border">Package Name</p>
                                        <p className="col-6 bg-dark text-white p-2 text-center border fw-bold">{el.parent_name} | {el.package_name}</p>
                                        <p className="col-6 p-2 text-center border">Package Progress</p>
                                        <p className="col-6 p-2 text-center border fw-bold">{(el.package_progress && el.package_progress.toFixed(2)) || 0}%</p>
                                    </div>
                                    <div className="col-12 d-flex flex-wrap border">
                                        <p className="col-6 col-md-3 p-2 text-center border">Estimated Duration</p>
                                        <p className="col-6 col-md-3 p-2 text-center border">{el.package_duration && el.package_duration.toFixed() || 0} HRS</p>
                                        <p className="col-6 col-md-3 p-2 text-center border">Issued Duration</p>
                                        <p className="col-6 col-md-3 p-2 text-center border">{(el.package_issued_duration && el.package_issued_duration.toFixed(0)) || 0} HRS</p>
                                    </div>

                                    <div className="col-12 d-flex flex-wrap border">
                                        {specialties(el.package_id).length > 0 && <p className="col-12 p-2 text-center border fw-bolder" style={{ background: "#8080803d" }}>Spciality Progress</p>}
                                        {
                                            specialties(el.package_id).length > 0 && specialties(el.package_id).map((sp, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <p className="col-4 p-2 text-center border">{sp.specialty_name}</p>
                                                        <p className="col-4 p-2 text-center border">{((sp.Done_Hrs / sp.Speciality_Duration) * 100).toFixed(2)} %</p>
                                                        <p className="col-4 p-2 text-center border">{sp.Speciality_Duration} HRS</p>
                                                        {/* <p className="col-2 p-2 text-center border">Issued Duration</p>
                                                        <p className="col-2 p-2 text-center border">Issued Duration</p> */}
                                                        {/* <p className="col-3 p-2 text-center border">{(el.package_issued_duration && el.package_issued_duration.toFixed(0)) || 0} HRS</p> */}
                                                    </React.Fragment>
                                                )
                                            })

                                        }

                                    </div>
                                </div>
                            );
                        })
                    }

                </section>
            </div>
        </div>
    )
}