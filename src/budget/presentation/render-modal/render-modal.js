import modalHTML from './render-modal.html?raw'

let modal, form;

const Elements = {
    inputPresupuesto: '#presupuesto-input',
    submitModal: '#presupuesto-btn'
}

export const showDivModal = () => {
    modal?.classList.remove('ocultar');
}

export const hideDivModal = () => {
    modal?.classList.add('ocultar');
}

export const renderModal = async (element) => {

    modal = document.createElement('DIV');
    modal.className = 'modal modal--presupuesto ocultar';
    modal.id = 'modal-presupuesto';
    modal.innerHTML = modalHTML;

    element.append(modal);
}