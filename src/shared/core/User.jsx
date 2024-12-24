export class User {
    constructor(userInfo) {
        this.id = userInfo.user_id;
        this.name = userInfo.user_name;
        this.roles = userInfo.user_roles;
    }

    isAppAdmin(appIndex) {
        let obj = this.roles.find(el => el.app_id == appIndex);
        return obj.role_id == 1 ? true : false;
    }
}