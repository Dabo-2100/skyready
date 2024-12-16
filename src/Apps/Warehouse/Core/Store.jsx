export class Store {
    constructor(warehouses) {
        this.warehouses = warehouses;
    }
    setCache() {
        sessionStorage.setItem("myStore", JSON.stringify(this));
    }
    getCache() {
        this.warehouses = JSON.parse(sessionStorage.getItem("myStore")).warehouses;
    }
    checkNewWarehouse(newName) {
        let index = this.warehouses.findIndex(el => el.name.toLowerCase() == newName);
        return index == -1 ? true : false;
    }
}