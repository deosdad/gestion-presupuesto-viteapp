

export default class Gasto{
    constructor(nombre, cantidad, fecha) {
        this.nombre = nombre;
        this.cantidad = Number(cantidad);
        this.fecha = fecha;
        this.id = Gasto.generarID();
    }

    static generarID() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            cantidad: this.cantidad,
            fecha: this.fecha
        };
    }
}