import { useRecoilValue } from "recoil";
import { $UserInfo } from "../../../store";
import { useContext } from "react";
import { HomeContext } from "../../../Pages/HomePage/HomeContext";


export class User {
    constructor() {
        const userInfo = useRecoilValue($UserInfo);
        const { appIndex } = useContext(HomeContext);
        this.id = userInfo.user_id;
        this.name = userInfo.user_name;
        this.roles = userInfo.user_roles;
        this.appIndex = appIndex;
    }
    isAdmin() {
        let obj = this.roles.find(el => el.app_id == this.appIndex);
        return obj.role_id == 1 ? true : false;
    }
}