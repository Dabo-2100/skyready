import PropTypes from "prop-types";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";

export default function PrintBtn({ contentRef }) {
    const printFn = useReactToPrint({ contentRef });
    return (
        <button onClick={printFn} className="btn btn-dark d-flex align-items-center gap-2">
            <FcPrint /> Print
        </button>
    )
}
PrintBtn.propTypes = {
    contentRef: PropTypes.object.isRequired,
};