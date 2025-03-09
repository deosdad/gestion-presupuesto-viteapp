import Presupuesto from '../../models/Presupuesto';
import presupuestoDb from '../../store/presupuesto-db';
import presupuestoHTML from './render-presupuesto.html?raw';
const ElementIDs = {
    presupuestoTotal: '#total',
    presupuestoRestante: '#restante'

}
let presupuestoContenido;

export const renderPresupesto = async(element) => {

    presupuestoContenido = document.createElement('DIV');
    presupuestoContenido.className = 'presupuesto';
    presupuestoContenido.innerHTML = presupuestoHTML;

    element.append(presupuestoContenido);

}

export const insertarPresupuesto =async() => {

    const {presupuesto} = await presupuestoDb.obtenerPresupuestoDB();

    presupuestoContenido.querySelector(ElementIDs.presupuestoTotal).textContent = presupuesto;

    const gastos = await presupuestoDb.obtenerTodosLosGastosDB();

    let restante = presupuesto - gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    
    presupuestoContenido.querySelector(ElementIDs.presupuestoRestante).textContent = restante;

    const elementRestante = presupuestoContenido.querySelector(ElementIDs.presupuestoRestante);

    elementRestante.classList.remove('green', 'orange', 'red');

    if (restante <= presupuesto / 4) {
        elementRestante.classList.add('red');
    } else if (restante <= presupuesto / 2) {
        elementRestante.classList.add('orange');
    } else {
        elementRestante.classList.add('green');
    }

    const nuevoPresupuesto = new Presupuesto(presupuesto, restante);

    await presupuestoDb.guardarPresupuestoDB(nuevoPresupuesto);
}

