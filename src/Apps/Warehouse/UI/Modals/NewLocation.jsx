import { useContext, useRef } from "react";
import Warehouse from "../../Core/Warehouse";
import ModalSmall from "./ModalSmall";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from 'recoil'
import { $Server, $Token, $LoaderIndex } from '../../../../store'
import { WarehouseContext } from "../../warehouseContext";
import { HomeContext } from "../../../../Pages/HomePage/HomeContext";

export default function NewLocation() {
    const { activeWarehouse } = useContext(WarehouseContext);
    const { closeModal } = useContext(HomeContext);
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const [, setLoaderIndex] = useRecoilState($LoaderIndex);
    const warehouse = new Warehouse(activeWarehouse);
    const handleAdd = (event) => {
        event.preventDefault();
        let newLocation = newLocationInput.current.value;
        if (newLocation) {
            warehouse.newLocation(serverUrl, token, newLocationInput.current.value).then((res) => {
                if (res == null) {
                    Swal.fire({
                        icon: "error",
                        text: "Location name is already registered at this warehouse"
                    })
                }
                else {
                    Swal.fire({
                        icon: "success",
                        text: "Location name added successfully",
                        timer: 1200,
                        showConfirmButton: false,
                    }).then(() => { closeModal() })
                }
            })
        }
        else {
            Swal.fire({
                icon: "info",
                text: "Please fill location name first !"
            })
        }
    }
    const newLocationInput = useRef();
    return (
        <ModalSmall title="Add new location" style={{ backgroundColor: "rgb(0 8 12 / 35%)" }}>
            <div className={"col-12 d-flex flex-wrap"}>
                <form onSubmit={handleAdd} className="col-12 text-dark d-flex flex-wrap px-3 pb-3 gap-3 justify-content-between align-items-center">
                    <input type="text" ref={newLocationInput} className="form-control" placeholder="Enter Location Name" />
                    <button className="col-12 btn addBtn">Add</button>
                </form>
            </div>
        </ModalSmall>
    )
}
