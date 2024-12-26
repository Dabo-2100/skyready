import { useContext } from "react";
import useAircraftData from "../hooks/useAircraftData"
import { AircraftFleetContext } from "../../AircraftFleetContext";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";

export default function WorkPackagesTable() {
    const { openModal2 } = useContext(HomeContext);
    const { setOpenPackage_id } = useContext(AircraftFleetContext);
    const { aircraftWorkPackages } = useAircraftData();
    return (
        <table className="table table-bordered text-center table-hover">
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
                        <tr key={el.package_id} onClick={() => { setOpenPackage_id(el.package_id); openModal2(4002); }}>
                            <td>{index + 1}</td>
                            <td>{el.parent_name && `${el.parent_name}  |`} {el.package_name}</td>
                            <td> {el.package_desc}</td>
                            <td> {el.package_issued_duration}</td>
                            <td> {el.estimated_duration && el.estimated_duration.toFixed(1)}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}
