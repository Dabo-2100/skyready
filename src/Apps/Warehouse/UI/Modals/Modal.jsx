import { useContext, useEffect } from "react"
import { HomeContext } from "../../../../Pages/HomePage/HomeContext"
import CloseBtn from "../Components/CloseBtn";
import PropTypes from "prop-types";

export default function Modal(props) {
    const { closeModal } = useContext(HomeContext);
    // Modal Default Logic
    const handleKeyDown = (event) => { if (event.key === "Escape") { closeModal() } };
    useEffect(() => {
        window.removeEventListener("keydown", handleKeyDown);
        window.addEventListener("keydown", handleKeyDown);
        return () => { window.removeEventListener("keydown", handleKeyDown); }
    }, [])

    return (
        <div {...props} className={`modal ${props.className}`}>
            <div style={{ maxHeight: "90vh" }} className="content container col-12 d-flex flex-column rounded-3 py-3 text-dark animate__animated animate__fadeIn">
                <div className="col-12 d-flex">
                    <CloseBtn onClick={closeModal} label={`Back`} />
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
