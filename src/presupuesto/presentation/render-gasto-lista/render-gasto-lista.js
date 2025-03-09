
import presupuestoDb from '../../store/presupuesto-db';
import { mostrarMensaje } from '../render-gasto-form/render-gasto-form';
import { insertarPresupuesto } from '../render-presupuesto/render-presupuesto';
import listaGastosHTML from './render-gasto-lista.html?raw';

let listaGastos;

const ElementIDs = {
    listaGasto: '#gastos'
}

export const renderListadoGastos = (element, edicion) => {

    listaGastos = document.createElement('DIV');
    listaGastos.className = 'lista sombras-fixed';
    listaGastos.innerHTML = listaGastosHTML;

    element.append(listaGastos);

}

export const insertarGastosLista = async (edicion) => {

    const lista = listaGastos.querySelector(ElementIDs.listaGasto);

    if (lista) {
        while (lista.firstChild) {
            lista.removeChild(lista.firstChild);
        }
    }
    const gastos = await presupuestoDb.obtenerTodosLosGastosDB();

    gastos.forEach(gasto => {
        const { nombre, cantidad, fecha, id } = gasto;

        const gastoElemento = document.createElement('div');
        gastoElemento.className = 'lista__item';
        gastoElemento.dataset.id = id;
        gastoElemento.innerHTML = `
                <div class="lista__cantidad">
                    <p class="lista__moneda"><span class="lista__dinero">${cantidad}</span>
                    €</p>
                </div>
                <div class="lista__info">
                    <p class="lista__nombre">${nombre}</p>
                    <p class="lista__fecha">${fecha}</p>
                </div>
                <div class="lista__acciones">
                    <button class="button-red" data-id="${id}">X</button>
                    <button class="button-edit" data-id="${id}">🖉</button>
                </div>
            `;

        lista.appendChild(gastoElemento);
    });

    lista.querySelectorAll('.button-red').forEach(eliminar => {
        eliminar.addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            await presupuestoDb.eliminarGastoDB(id);
            await insertarPresupuesto();
            await insertarGastosLista();
            mostrarMensaje('Eliminado correctamente', 'success');
        });
    });

    lista.querySelectorAll('.button-edit').forEach(editar => {
        editar.addEventListener('click', async (event) => {
            const id = event.target.dataset.id;
            const { nombre, cantidad, fecha } = await presupuestoDb.obtenerGastoIDDB(id);

            document.querySelector('#gasto').value = nombre;
            document.querySelector('#cantidad').value = cantidad;
            document.querySelector('#fecha').value = fecha;
            document.querySelector('#id').value = id;
            document.querySelector('.gasto__button').textContent = 'Editar';


        });
    });


}

