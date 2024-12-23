import { useContext, useEffect, useRef } from "react"
import { HomeContext } from "../../../../Pages/HomePage/HomeContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function ModalSmall({ id, children, title }) {
    const { closeModal } = useContext(HomeContext);
    const handleKeyDown = (event) => { if (event.key === "Escape") { closeModal() } };
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => { window.removeEventListener("keydown", handleKeyDown) }
    }, [])
    return (
        <div className="modal" id={id && `${id}`} onKeyDown={(event) => { event.key == "Escape" ? closeModal() : null }}>
            <div className="col-10 col-md-4 bg-white rounded-3 animate__animated animate__fadeInDown">
                <div className="col-12 d-flex p-3 justify-content-between align-items-center">
                    <h5 className="text-center text-dark m-0">{title}</h5>
                    <FontAwesomeIcon onClick={closeModal} icon={faX} className="btn btn-danger" />
                </div>
                {children}
            </div>
        </div >
    )
}