import { useContext } from "react";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { removeDesignator } from "../../state/selectedDesignatorsSlice";


export default function TaskWorkingDesignators() {
    const { openModal4 } = useContext(HomeContext);
    const dispatch = useDispatch();
    const selectedDesignators = useSelector(state => state.aircraftFleet.selectedDesignators.value);
    return (
        <div className="col-12 d-flex flex-wrap">
            <div className="col-12 d-flex align-items-center justify-content-between">
                <label>Task Designators</label>
                <button type="button" className="addMoreButton" onClick={() => openModal4(1007)}>
                    <div className="sign">+</div>
                    <div className="text">Add Designator</div>
                </button>
            </div>
            <div className="col-12 d-flex flex-wrap gap-3">
                {(selectedDesignators.length > 0) && (selectedDesignators.map((el) => {
                    return (
                        <button type="button" className="btn addBtn d-flex align-items-center gap-3" key={el.designator_id}>
                            <p>{el.designator_name}</p>
                            <FontAwesomeIcon icon={faX} onClick={() => dispatch(removeDesignator(el.designator_id))} />
                        </button>
                    )
                })
                )}
            </div>
        </div>
    )
}
