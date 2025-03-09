import html from './app.html?raw';
import Presupuesto from './models/Presupuesto';
import { renderGastoForm } from './presentation/render-gasto-form/render-gasto-form';
import { insertarGastosLista, renderListadoGastos } from './presentation/render-gasto-lista/render-gasto-lista';
import { renderInfo } from './presentation/render-info/render-info';
import { renderModal } from './presentation/render-modal/render-modal';
import { insertarPresupuesto, renderPresupesto } from './presentation/render-presupuesto/render-presupuesto';
import presupuestoDb from './store/presupuesto-db';


const Elementos = {
    interfazIzq: '#layout1',
    interfazDer: '#layout2',
    listaGastos: '#gastos'
}

/**
 * 
 * @param {HTMLDivElement} element 
 */
export const PresupuestoApp = async (element) => {

   
    const app = document.createElement('div');
    app.innerHTML = html;
    element.append(app);

    await presupuestoDb.openDB();

    const hayPresupuesto = await presupuestoDb.obtenerPresupuestoDB();
    const divLeftLayout = element.querySelector(Elementos.interfazIzq);
    const divRightLayout = element.querySelector(Elementos.interfazDer);

    renderGastoForm(divLeftLayout);

    renderPresupesto(divLeftLayout);

    renderListadoGastos(divRightLayout);

    renderInfo(divLeftLayout);

    renderModal(element, hayPresupuesto);
}