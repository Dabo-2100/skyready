import { useEffect, useRef, useState } from "react"
import NoImg from '@/assets/offline.png'
import useAircraft from "../hooks/useAircraft";
import { useDispatch, useSelector } from "react-redux";
import { addDesignator, removeDesignator } from "../../state/selectedDesignatorsSlice";
import { useRecoilState } from "recoil";
import { $LoaderIndex } from "../../../../store-recoil";
import Modal from "../../../../shared/ui/modals/Modal";

export default function TaskDesignators() {
    const dispatch = useDispatch();
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const selectedDesignators = useSelector(state => state.aircraftFleet.selectedDesignators.value);
    const { filterAircraftDesignators, getDesignatorTypes, addNewDesignator, getAircraftDesignators, updateDesignatorType, removeAircraftDesignator } = useAircraft();
    const [designatorTypes, setDesignatorTypes] = useState([]);
    const [designators, setDesignators] = useState([]);
    const new_type_id = useRef();
    const designator_name = useRef();

    const deleteDesignator = (designator_id) => {
        removeAircraftDesignator(designator_id).then(() => { setDesignators([]) });
    }

    const updateDesignator = (designator_id, type_id) => {
        updateDesignatorType(designator_id, type_id)
    }

    const handleAdd = () => { addNewDesignator(designator_name, new_type_id) }

    const showAll = () => {
        setLoaderIndex(true)
        getAircraftDesignators().then(setDesignators).then(setLoaderIndex(false));
    }

    const handleSearch = () => {
        setLoaderIndex(true)
        filterAircraftDesignators(designator_name).then(setDesignators).then(setLoaderIndex(false));
    }

    const toggleDesignator = (designator_id, designator_name) => {
        let isHere = selectedDesignators.findIndex(el => el.designator_id == designator_id);
        isHere == -1 ? dispatch(addDesignator({ designator_id, designator_name })) : dispatch(removeDesignator(designator_id));
    }

    useEffect(() => { getDesignatorTypes().then(setDesignatorTypes) }, []);

    return (
        <Modal>
            <main className="col-12 d-flex flex-wrap">
                <div className="col-12 d-flex flex-wrap gap-3">
                    <div className="col-12 inputField">
                        <label className="col-12 col-lg-5" htmlFor="mn">Search By Designator Name</label>
                        <div className="col-12 d-flex gap-4">
                            <input className="form-control" style={{ width: "70%" }} type="text" id="mn" ref={designator_name} placeholder="Enter Designator name" />
                            <button className="btn btn-success text-success bg-success-subtle flex-grow-1" onClick={handleSearch}>Search</button>
                            <button className="btn btn-primary" type="button" onClick={showAll}>Show All</button>
                        </div>
                    </div>
                </div>
                {
                    selectedDesignators.length > 0 &&
                    <div className="col-12 d-flex flex-wrap gap-3 py-2">
                        <p>Selected Designators</p>
                        <div className="col-12 d-flex flex-wrap gap-3">
                            {
                                selectedDesignators.map((el) => {
                                    return (
                                        <button key={el.designator_id} className="btn addBtn">
                                            {el.designator_name}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                }

            </main>
            {
                designators.length > 0 ?
                    (
                        <footer className="col-12 d-flex gap-3 flex-wrap align-items-center align-content-center p-3">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>-</th>
                                        <th>Designator Name</th>
                                        <th>Designator Type</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        designators.map((el) => {
                                            return (
                                                <tr key={el.designator_id}>
                                                    <td>
                                                        <div className="cntr">
                                                            <input
                                                                defaultChecked={
                                                                    selectedDesignators.findIndex((designator) => {
                                                                        return designator.designator_id == el.designator_id;
                                                                    }) == -1 ? false : true
                                                                }
                                                                onChange={() => toggleDesignator(el.designator_id, el.designator_name)}
                                                                id={`zone_${el.designator_id}`} type="checkbox" className="hidden-xs-up input" />
                                                            <label htmlFor={`zone_${el.designator_id}`} className="cbx"></label>
                                                        </div>
                                                    </td>
                                                    <td>{el.designator_name}</td>
                                                    <td>
                                                        <select className="form-select" defaultValue={el.type_id} onChange={(event) => updateDesignator(el.designator_id, event.target.value)}>
                                                            {
                                                                designatorTypes.map((type) => {
                                                                    return <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </td>
                                                    <td><button className="btn btn-danger" onClick={() => deleteDesignator(el.designator_id)}>remove</button></td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </footer>
                    ) : (
                        designator_name.current && designator_name.current.value && (
                            <div className="col-12 gap-3 jusify-self-center d-flex flex-column align-items-center p-3">
                                <img height={100} src={NoImg} />
                                <h6 className="text-center col-12">This Designator [ {designator_name.current.value} ] is Not Register to this Aircraft Model</h6>
                                <div className="col-12 d-flex flex-wrap gap-2">
                                    <div className="d-flex col-12 gap-3 align-items-center justify-content-center">
                                        <label >Select Designator Type : </label>
                                        <div className="d-flex">
                                            <select className="form-select flex-grow-0" ref={new_type_id}>
                                                {
                                                    designatorTypes.map((type) => {
                                                        return <option key={type.type_id} value={type.type_id}>{type.type_name}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <button className="btn addBtn" onClick={handleAdd}>Add Desingator</button>
                                    </div>
                                </div>
                            </div>
                        )
                    )
            }
        </Modal>
    )
}
