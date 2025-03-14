

export default class Budget {
    constructor(initial, remaining) {
        this.initial = Number(initial);
        this.remaining = Number(remaining);
    }

    toJSON() {
        return {
            initial: this.initial,
            remaining: this.remaining
        };
    }
}