import { useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { refresh } from "../../state/refreshIndexSlice";
import { closeModal } from "../../state/modalSlice";
import PropTypes from "prop-types";

export default function ModalSmall({ id, children, title }) {
    const dispatch = useDispatch();
    const handleKeyDown = (event) => { if (event.key === "Escape") { dispatch(closeModal()) } };
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => { dispatch(refresh()); window.removeEventListener("keydown", handleKeyDown) }
    }, [])
    return (
        <div className="modal" id={id && `${id}`} onKeyDown={(event) => { event.key == "Escape" ? dispatch(closeModal()) : null }}>
            <div className="col-10 col-md-4 bg-white rounded-3 animate__animated animate__fadeInDown">
                <div className="col-12 d-flex p-3 justify-content-between align-items-center">
                    <h5 className="text-center text-dark m-0">{title}</h5>
                    <FontAwesomeIcon onClick={() => dispatch(closeModal())} icon={faX} className="btn btn-danger" />
                </div>
                {children}
            </div>
        </div >
    )
}

ModalSmall.propTypes = {
    id: PropTypes.string,
    children: PropTypes.node,
    title: PropTypes.string,
};