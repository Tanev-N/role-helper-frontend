import { RootStore } from "@/stores/RootStore";

let store: RootStore | null = null;

export default function useStore() {
    if (!store) store = new RootStore();
    return store;
}