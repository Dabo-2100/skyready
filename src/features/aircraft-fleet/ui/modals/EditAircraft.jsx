import Modal from "../../../../Apps/Warehouse/UI/Modals/Modal";
import WorkPackagesTable from "../components/WorkPackagesTable.jsx";
import AircraftDataForm from "../components/AircraftDataForm.jsx";

export default function EditAircraft() {
    return (
        <Modal>
            <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <h6 className="p-0 m-0">Aircraft Data</h6>
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <AircraftDataForm />
                        </div>
                    </div>
                </div>

                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                            <h6 className="p-0 m-0">Applicable Work Packages</h6>
                        </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <WorkPackagesTable />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}