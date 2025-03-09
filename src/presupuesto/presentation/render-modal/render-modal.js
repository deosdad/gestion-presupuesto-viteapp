import Presupuesto from '../../models/Presupuesto';
import presupuestoDb from '../../store/presupuesto-db';
import { mostrarMensaje } from '../render-gasto-form/render-gasto-form';
import { insertarGastosLista } from '../render-gasto-lista/render-gasto-lista';
import { insertarPresupuesto } from '../render-presupuesto/render-presupuesto';
import modalHTML from './render-modal.html?raw'

let modal, form;

const Elements = {
    inputPresupuesto: '#presupuesto-input',
    submitModal: '#presupuesto-btn'
}

export const showModal = () => {
    modal?.classList.remove('hidden');
}

export const hideModal = () => {
    modal?.classList.add('hidden');
    form?.reset();
}

export const renderModal = async(element, bool) => {


    if (!bool) {

       

        modal = document.createElement('DIV');
        modal.className = 'modal modal--presupuesto hidden';
        modal.id = 'modal-presupuesto';
        modal.innerHTML = modalHTML;

        showModal();

        form = modal.querySelector('form');

        form.addEventListener('submit', async(event) => {
            event.preventDefault();

            const presupuesto = Number(modal.querySelector(Elements.inputPresupuesto).value);

            if (!presupuesto || isNaN(presupuesto) || presupuesto <= 0) {
                mostrarMensaje('El presupuesto no es valido', 'error');
                return;
            }

            const presupuestoInicial = new Presupuesto(presupuesto, presupuesto);
            await presupuestoDb.guardarPresupuestoDB(presupuestoInicial);
            await insertarPresupuesto();
            hideModal();
            
        });

        element.append(modal);
    }else{
        await insertarGastosLista();
        await insertarPresupuesto();
    }

    
}