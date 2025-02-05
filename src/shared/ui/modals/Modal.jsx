import { useEffect } from "react"
import PropTypes from "prop-types";
import { closeModal } from "../../state/modalSlice";
import { useDispatch } from "react-redux";
import CloseBtn from "../components/CloseBtn/CloseBtn";

export default function Modal(props) {
    const dispatch = useDispatch();
    // Modal Default Logic
    const handleKeyDown = (event) => { if (event.key === "Escape") { dispatch(closeModal()) } };
    useEffect(() => {
        window.removeEventListener("keydown", handleKeyDown);
        window.addEventListener("keydown", handleKeyDown);
        return () => { window.removeEventListener("keydown", handleKeyDown); }
        // eslint-disable-next-line
    }, [])

    return (
        <div {...props} className={`modal ${props.className}`}>
            <div style={{ maxHeight: "90vh" }} className="content container col-12 d-flex flex-column rounded-3 py-3 text-dark animate__animated animate__fadeIn">
                <div className="col-12 d-flex">
                    <CloseBtn onClick={() => dispatch(closeModal())} label={`Back`} />
                </div>
                {props.children}
            </div>
        </div >
    )
}

Modal.propTypes = {
    className: PropTypes.object,
    children: PropTypes.node,
};
