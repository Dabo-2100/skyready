// import { useState } from "react";
import Swal from "sweetalert2";
import { Store } from "../../Core/Store";
import { inventoryRepo } from "../../Data/Repos/inventoryRepo";
export default function useNewWarehouse() {
    const store = new Store();
    store.getCache();

    const getUsers = async (serverUrl, token) => {
        let final = [];
        await inventoryRepo.get_warehouses_users(serverUrl, token).then((res) => {
            final = res.map((el) => { return { label: el.user_name, value: el.user_id } });
        })
        return final;
    };

    const toggleUser = (arr1, arr2) => {
        if (arr1.length > arr2.length) {
            return arr1.filter(obj1 => !arr2.some(obj2 => obj2["value"] === obj1["value"]));
        }
        else {
            return arr1.filter(obj1 => arr2.some(obj2 => obj2["value"] === obj1["value"]));

        }
    }

    const handleSubmit = (serverUrl, token, data) => {
        if (data.newName) {
            let nameCheck = store.warehouses.some(el => el.warehouse_name.toLowerCase() == data.newName.toLowerCase());
            let adminsCheck = data.adminsRef.current.props.value && data.adminsRef.current.props.value.length > 0;
            if (nameCheck) {
                Swal.fire({ icon: "error", text: "Duplicated warehouse name", timer: 1200 })
            } else {
                if (!adminsCheck) {
                    Swal.fire({ icon: "error", text: "Warehouse must have one admin at least", timer: 1200 })
                }
                else {
                    inventoryRepo.new_warehouse(serverUrl, token, {
                        warehouse_name: data.newName,
                        warehouse_admins: data.adminsRef.current.props.value,
                        warehouse_users: data.usersRef.current.props.value
                    }).then(() => {
                        Swal.fire({ icon: "success", text: "Warehouse added successfully !", timer: 1200 })
                    })
                }
            }
        } else {
            return Swal.fire({ icon: "error", text: "Please fill warehouse name !", timer: 1200 });
        }
    }

    return { getUsers, handleSubmit, toggleUser }
}