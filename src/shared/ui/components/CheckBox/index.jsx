import "./index.css";
import PropTypes from "prop-types";

export default function CheckBox({ id, content, checked, onClick }) {
    return (
        <div className="checkbox-wrapper-4">
            <input type="checkbox" id={id} onChange={onClick} className="inp-cbx" defaultChecked={checked} />
            <label htmlFor={id} className="cbx">
                <span>
                    <svg height="10px" width="12px"></svg>
                </span>
                <span>{content}</span>
            </label>
            <svg className="inline-svg">
                <symbol viewBox="0 0 12 10" id="check-4">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </symbol>
            </svg>
        </div>
    )
}

CheckBox.propTypes = {
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onClick: PropTypes.func
};
