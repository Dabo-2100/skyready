import { useContext, useEffect, useRef, useState } from "react"
import { useRecoilState } from "recoil";
import { $Server, $Token, $SwalDark } from "@/store";
import axios from "axios";
import Swal from "sweetalert2";
import { HomeContext } from "@/Pages/HomePage/HomeContext";

export default function NewModal() {
    // ==================================================>
    const { closeModal, openModal2, refresh, refreshIndex } = useContext(HomeContext)
    // ==================================================>
    const [serverUrl] = useRecoilState($Server);
    const [token] = useRecoilState($Token);
    const [darkSwal] = useRecoilState($SwalDark);
    // ==================================================>
    // const [aircraftObj, serAircraftObj] = useState({});
    // ==================================================>
    // const handleChange = () => {
    //     if (event.target.value > 1000) {
    //         openModal2(+event.target.value);
    //         event.target.value = 0;
    //     }
    // }
    // ==================================================>
    useEffect(() => {
    }, [refreshIndex])
    return (
        <div className="modal" id="AircraftInfo">
            <div className="content text-dark container animate__animated animate__fadeIn" onClick={(event) => { event.stopPropagation() }}>
                <div className="col-12 pt-2">
                    <button className="backButton" onClick={() => { closeModal() }}>
                        <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                        <span>Back</span>
                    </button>
                </div>
                <header className="col-12 d-flex align-items-center justify-content-between">
                </header>
                <main className="col-12 d-flex flex-wrap">
                </main>
                <hr className="col-12 p-0" />
                <section className="col-12 p-2">
                </section>
            </div>
        </div>
    )
}