import { useRef } from "react";
import useAircraftData from "../hooks/useAircraftData"
import { setActiveId } from "../../state/activeWorkPackageIdSlice";
import { useDispatch } from "react-redux";
import PrintBtn from "../../../../shared/ui/components/PrintBtn";
import { openModal2 } from "../../../../shared/state/modalSlice";

export default function WorkPackagesTable() {
    const dispatch = useDispatch();
    const { aircraftWorkPackages } = useAircraftData();
    const table = useRef()
    return (
        <div className="col-12 d-flex flex-wrap justify-content-end">
            <PrintBtn contentRef={table} />
            <table ref={table} className="table table-bordered text-center table-hover">
                <thead>
                    <tr>
                        <th>-</th>
                        <th className="col-3">Package Name</th>
                        <th>Package Description</th>
                        <th>Issued Duration</th>
                        <th>Estimated Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {aircraftWorkPackages.map((el, index) => {
                        return (
                            <tr key={el.package_id} onClick={() => {
                                dispatch(setActiveId(el.package_id))
                                dispatch(openModal2(4002));
                            }}>
                                <td>{index + 1}</td>
                                <td>{el.parent_name && `${el.parent_name}  | `} {el.package_name}</td>
                                <td> {el.package_desc}</td>
                                <td> {el.package_issued_duration}</td>
                                <td> {el.estimated_duration && el.estimated_duration.toFixed(1)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
