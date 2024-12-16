import { useContext } from "react"
import { HomeContext } from "../../../../Pages/HomePage/HomeContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faHome } from "@fortawesome/free-solid-svg-icons";

export default function FullModal(props) {
    const { closeModal } = useContext(HomeContext);
    return (
        <div id={props.id} className={`modalFull col-12 d-flex justify-content-center ${props.className}`}>
            <div style={{ width: "1250px", maxWidth: "96%" }} className="col-12 h-100 d-flex flex-column animate__animated animate__fadeIn" >
                <div className="col-12 d-flex gap-3 p-3 modalHeader">
                    <FontAwesomeIcon icon={faHome} className="homeIcon" onClick={closeModal} />
                    <FontAwesomeIcon icon={faAngleRight} />
                    <p>{props.name || 'Warehouse name'} </p>
                </div>
                {props.children}
            </div>
        </div >
    )
}

FullModal.Content = ({ children }) => {
    return (
        <div style={{ height: "1vh" }} className="col-12 d-flex flex-column align-items-start flex-grow-1">
            {children}
        </div>)
}