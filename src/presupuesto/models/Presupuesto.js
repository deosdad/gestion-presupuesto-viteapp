

export default class Presupuesto {
    constructor(presupuesto, restante) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(restante);
    }

    toJSON() {
        return {
            presupuesto: this.presupuesto,
            restante: this.restante
        };
    }
}