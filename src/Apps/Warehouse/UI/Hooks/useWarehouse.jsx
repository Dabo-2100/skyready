// import { useState } from "react";
import Swal from "sweetalert2";
import { warehouseRepo } from "../../Data/Repos/warehouseRepo";
export default function useWarehouse() {
    const removeLocation = async (serverUrl, token, location_id) => {
        Swal.fire({
            icon: "error",
            text: "Are you sure you want to remove this location ?",
            showDenyButton: true,
            showConfirmButton: true,
        }).then((res) => {

        })
    };

    const editLocation = async (serverUrl, token, location) => {
        if (location.location_items && location.location_items.length) {
            Swal.fire({
                icon: "question",
                text: "Are you sure you want to move all items into this location to another location?",
                showDenyButton: true,
                showConfirmButton: true,
                denyButtonText: "Not now",
                confirmButtonText: "Move Items"
            }).then((res) => {
                res.isConfirmed && Swal.fire({
                    icon: "info",
                    text: `You will remove ${location.location_items.length} items from location ${location.location_name}`,
                }).then((res2) => {
                    openModal()
                })
            })
        }
        else {
            Swal.fire({
                icon: "error",
                text: "There are no items to move from this location"
            })
        }
    };

    const addNewItem = async (serverUrl, token, inputs) => {
        let item_obj = {
            item_pn: inputs[0].value,
            item_name: inputs[1].value,
            category_id: inputs[2].props.value && inputs[2].props.value.value,
            unit_id: inputs[3].props.value && inputs[3].props.value.value,
            item_sn: inputs[4].value,
            item_nsn: inputs[5].value,
        }
        if (item_obj.item_pn && item_obj.unit_id && item_obj.category_id) {
            await warehouseRepo.new_item(serverUrl, token, item_obj).then((res) => {
                if (res.err) {
                    Swal.fire({
                        icon: "error",
                        text: res.msg.errorInfo[2],
                    })
                } else {
                    Swal.fire({
                        icon: "success",
                        text: "Item Added Successfully !",
                        timer: 1500,
                    })
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                text: "Please fill required data",
                timer: 1500,
            })
        }
    }

    const addNewCat = async (serverUrl, token, catName) => {
        let obj = { category_name: catName }
        if (catName) {
            await warehouseRepo.new_cat(serverUrl, token, obj).then((res) => {
                if (res.err) {
                    Swal.fire({
                        icon: "error",
                        text: res.msg.errorInfo[2],
                    })
                } else {
                    Swal.fire({
                        icon: "success",
                        text: "Category Added Successfully !",
                        timer: 1500,
                    })
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                text: "Please Enter Category Name ",
                timer: 1500,
            })
        }
    }

    const addNewUnit = async (serverUrl, token, unitName) => {
        let obj = { unit_name: unitName }
        if (unitName) {
            await warehouseRepo.new_unit(serverUrl, token, obj).then((res) => {
                if (res.err) {
                    Swal.fire({
                        icon: "error",
                        text: res.msg.errorInfo[2],
                    })
                } else {
                    Swal.fire({
                        icon: "success",
                        text: "Unit Added Successfully !",
                        timer: 1500,
                    })
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                text: "Please Enter Unit Name ",
                timer: 1500,
            })
        }
    }

    const getAllUnits = async (serverUrl, token) => {
        return await warehouseRepo.all_units(serverUrl, token);
    }

    const getAllItems = async (serverUrl, token) => {
        return await warehouseRepo.all_items(serverUrl, token, "all");
    }

    const getAllCats = async (serverUrl, token) => {
        return await warehouseRepo.all_cats(serverUrl, token);
    }

    const getAllLocations = async (serverUrl, token, warehouse_id) => {
        return await warehouseRepo.refresh_locations(serverUrl, token, warehouse_id);
    }

    const getAllPacklists = async (serverUrl, token) => {
        return await warehouseRepo.all_packlists(serverUrl, token);
    }

    const addNewPacklist = async (serverUrl, token, catName) => {
        let obj = { packlist_name: catName }
        if (catName) {
            await warehouseRepo.new_packlist(serverUrl, token, obj).then((res) => {
                if (res.err) {
                    Swal.fire({
                        icon: "error",
                        text: res.msg.errorInfo[2],
                    })
                } else {
                    Swal.fire({
                        icon: "success",
                        text: "Packlist Added Successfully !",
                        timer: 1500,
                    })
                }
            })
        } else {
            Swal.fire({
                icon: "error",
                text: "Please Enter Packlist Name ",
                timer: 1500,
            })
        }
    }

    return {
        removeLocation, editLocation,
        addNewItem, getAllCats,
        getAllItems, addNewCat, getAllUnits,
        addNewUnit, getAllLocations, getAllPacklists,
        addNewPacklist
    }
}