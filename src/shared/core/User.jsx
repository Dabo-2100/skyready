export class User {
    constructor(userInfo) {
        this.id = userInfo.user_id;
        this.name = userInfo.user_name;
        this.roles = userInfo.user_roles;
        this.is_super = userInfo.is_super;
    }

    isSuper() { return this.is_super == 1 ? true : false }

    isAppAdmin(appId) {
        let obj = this.roles.find(el => el.app_id == appId);
        return (obj && obj.role_id == 1) ? true : false;
    }
}