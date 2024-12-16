import { Store } from "../../Core/Store";
export default function useStore() {
    const store = new Store();
    store.getCache();
}