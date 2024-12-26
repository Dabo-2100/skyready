import PropTypes from "prop-types"

export default function FormField({ id, label, type = "text", disabled, defaultValue, refCallback, placeholder }) {
    return (
        <div className="col-12 col-lg-5 inputField">
            <label className="col-12" htmlFor={id}>{label}</label>
            <input
                disabled={disabled}
                defaultValue={defaultValue}
                className="col-12 form-control"
                type={type}
                id={id}
                ref={refCallback}
                placeholder={placeholder}
            />
        </div>
    )
}

FormField.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
    refCallback: PropTypes.func,
    placeholder: PropTypes.string
};