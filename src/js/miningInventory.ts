import eventManager from "./eventManager";

class MiningInventory {
    public storage: any;
    public state: any;

    constructor() {
        eventManager.subscribe("add-mined", this.add, this);
        this.storage = {};
        this.state = {};
    }

    public add(current: any) {
        // if state object doesn't exist, add all particles to storage
        if (!this.state[current.ID]) {
            this.updateState(current);
            this.incrementStorage(this.stripID(current));

            // if it does exist, check curr vs state and add only the right particles
        } else {
            this.incrementStorage(this.stripID(this.checkState(current)));
            this.updateState(current);
        }

        const displayableParticles = this.storage;
        eventManager.publish("display-mined", displayableParticles);
    }

    public checkState(current: any) {
        const checked = {};
        Object.keys(current).forEach(key => {
            if (!checked[key]) {
                checked[key] = 0;
            }
            if (!this.state[current.ID][key]) {
                this.state[current.ID][key] = 0;
            }
            checked[key] = current[key] - this.state[current.ID][key];
        });
        return checked;
    }

    public incrementStorage(particles: any) {
        Object.keys(particles).forEach(key => {
            if (!this.storage[key]) {
                this.storage[key] = 0;
            }
            this.storage[key] += particles[key];
        });
    }

    public updateState(current: any) {
        this.state[current.ID] = Object.assign({}, current);
    }

    public stripID(current: any) {
        const particles = {};
        Object.keys(current).forEach(key => {
            if (key !== "ID") {
                particles[key] = current[key];
            }
        });
        return particles;
    }
}

export default new MiningInventory();
