import { useContext } from "react";
import { useRecoilValue } from "recoil"
import Swal from "sweetalert2";
import { $Server, $Token } from "../../../../store-recoil"
import { UsersRepo } from "../../data/repositories/UsersRepo";
import { formCheck } from "../../../../customHooks";
import { UserContext } from "../../UserContext";
import { closeModal } from "../../../../shared/state/modalSlice";
import { refresh } from "../../../../shared/state/refreshIndexSlice";
import { useDispatch } from "react-redux";

export default function useUsers() {
    const dispatch = useDispatch();
    const serverUrl = useRecoilValue($Server);
    const token = useRecoilValue($Token);
    const { userToEdit } = useContext(UserContext)

    const registerNewUser = async (formInputs, selectedRoles) => {
        let formErrors = formCheck([
            { value: formInputs.current[0].value, options: { required: true } },
            { value: formInputs.current[1].value, options: { required: true } },
            { value: selectedRoles, options: { arrayNotEmpty: true } },
        ]);
        if (formErrors == 0) {
            let data = {
                user_email: formInputs.current[0].value,
                user_name: formInputs.current[1].value,
                specialty_id: formInputs.current[2].value,
                is_super: formInputs.current[3].checked,
                user_roles: selectedRoles
            }
            UsersRepo.register_new_user(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "User added successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                }).then(() => {
                    res == true && dispatch(closeModal());
                })
            })
        } else {
            Swal.fire({
                icon: "error",
                text: "Please fill all user data first",
                timer: 1500,
            });
        }
    }

    const getUsers = async () => {
        return UsersRepo.all_users(serverUrl, token)
    }

    const getSystemDefaults = async () => {
        return UsersRepo.system_defaults(serverUrl, token)
    }

    const toggleRoleFromArray = async (rolesArray, app_id, role_id) => {
        let final = [];
        let roleIndex = rolesArray.findIndex(el => el.app_id == app_id);
        let obj = { app_id, role_id }
        if (roleIndex == -1) {
            final = [...rolesArray, obj]
        }
        else {
            if (role_id == -1) {
                rolesArray.splice(roleIndex, 1);
                final = [...rolesArray];
            }
            else {
                let oRoles = [...rolesArray];
                oRoles[roleIndex] = obj;
                final = [...rolesArray, obj]
            }
        }
        return final;
    }

    const getUserFeatures = async () => {
        return UsersRepo.get_user_features(serverUrl, token, userToEdit);
    }

    const updateUserFeatuers = async (formInputs, selectedRoles) => {
        let formErrors = formCheck([
            { value: formInputs.current[0].value, options: { required: true } },
        ]);
        if (formErrors == 0) {
            let data = {
                user_id: userToEdit,
                user_name: formInputs.current[0].value,
                specialty_id: formInputs.current[1].value,
                is_super: formInputs.current[2].checked,
                user_roles: selectedRoles
            }
            UsersRepo.update_user_features(serverUrl, token, data).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "User Updated successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                }).then(() => {
                    res == true && dispatch(refresh());
                })
            })
        } else {
            Swal.fire({
                icon: "error",
                text: "Please fill all user data first",
                timer: 1500,
            });
        }
    }

    const activateUser = async () => {
        Swal.fire({
            icon: "question",
            text: "Are you sure you want to activate this user ?",
            showCancelButton: true,
        }).then((res) => {
            res.isConfirmed && UsersRepo.activate_user(serverUrl, token, userToEdit).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "User Activated successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                }).then(() => {
                    res == true && dispatch(refresh());
                })
            });
        })
    }

    const removeUser = async () => {
        Swal.fire({
            icon: "error",
            text: "Are you sure you want to Delete this user ?",
            showCancelButton: true,
        }).then((res) => {
            res.isConfirmed && UsersRepo.delete_user(serverUrl, token, userToEdit).then((res) => {
                Swal.fire({
                    icon: res == true ? "success" : "error",
                    text: res == true ? "User Deleted successfully !" : res == undefined ? "Connection Problem" : res,
                    timer: 2500,
                }).then(() => {
                    res == true && dispatch(closeModal());
                })
            });
        })
    }
    return { getUsers, getSystemDefaults, toggleRoleFromArray, registerNewUser, getUserFeatures, updateUserFeatuers, activateUser, removeUser }
}