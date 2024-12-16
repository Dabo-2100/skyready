import Swal from "sweetalert2";
import { warehouseRepo } from "../Data/Repos/warehouseRepo";

export default class Warehouse {
    constructor(warehouseData) {
        this.id = warehouseData.warehouse_id;
        this.name = warehouseData.warehouse_name;
        this.locations = warehouseData.locations;
        this.admins = warehouseData.admins;
        this.users = warehouseData.users;
    }

    async refreshLocations(serverUrl, token) {
        await warehouseRepo.refresh_locations(serverUrl, token, this.id).then((res) => {
            this.locations = res.data.locations;
        })
    }

    async newLocation(serverUrl, token, loaction_name) {
        let final = [];
        let obj = { warehouse_id: this.id, location_name: loaction_name };
        if (this.locations && this.locations.length > 0 && this.locations.some(el => el.location_name.toLowerCase() == loaction_name.toLowerCase())) {
            Swal.fire({
                icon: "error",
                text: "Location Name is Already Register at this warehouse",
                timer: 1200,
            })
        }
        else {
            await warehouseRepo.new_location(serverUrl, token, obj).then((res) => { final = res })
        }
        return final;
    }
}