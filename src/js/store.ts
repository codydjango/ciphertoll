import eventManager from "./eventManager";

class Store {
    public disabled: boolean;
    public storage: Storage;

    constructor() {
        if (typeof window.localStorage === "undefined") {
            console.log("no localstorage, saving disabled");
            window.alert("saving disabled");
            this.disabled = true;
        } else {
            this.disabled = false;
            this.storage = window.localStorage;
        }

        eventManager.subscribe("reset", this.clear, this);
    }

    public clear() {
        this.storage.clear();
    }

    public has(key: string) {
        return this.storage.getItem(key) !== null;
    }

    // how to use different types for 'value' here?
    // currently only ILandscape[][] is being stored,
    // but will include other objects later...
    public set(key: string, value: any) {
        console.log("store.set", key);

        this.storage.setItem(key, JSON.stringify(value));
    }

    public get(key: string) {
        console.log("store.get", key);

        return JSON.parse(this.storage.getItem(key)!);
    }
}

export const store = new Store();
