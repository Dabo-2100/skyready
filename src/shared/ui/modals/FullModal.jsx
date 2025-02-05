import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faHome } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { closeModal } from "../../state/modalSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { refresh } from "../../state/refreshIndexSlice";

export default function FullModal({ id, className, name, children }) {
    const dispatch = useDispatch()
    useEffect(() => {
        return () => { dispatch(refresh()) }
    }, [])
    return (
        <div id={id} className={`modalFull col-12 d-flex justify-content-center ${className}`}>
            <div style={{ width: "1440px", maxWidth: "98%" }} className="col-12 h-100 d-flex flex-column animate__animated animate__fadeIn" >
                <div className="col-12 d-flex gap-3 p-3 modalHeader">
                    <FontAwesomeIcon icon={faHome} className="homeIcon" onClick={() => dispatch(closeModal())} />
                    <FontAwesomeIcon icon={faAngleRight} />
                    <p>{name || 'Warehouse name'} </p>
                </div>
                <div style={{ height: "1vh" }} className="col-12 d-flex flex-column align-items-start flex-grow-1">
                    {children}
                </div>
            </div>
        </div >
    )
}

FullModal.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    children: PropTypes.node
};
