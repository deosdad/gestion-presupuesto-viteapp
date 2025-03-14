import infoHTML from './render-info.html?raw';
import infoModalHTML from './render-modal-info.html?raw';

export const renderInfo = async (element) => {

    const infoDiv = document.createElement('DIV');
    infoDiv.className = 'info';
    infoDiv.id = 'presupuesto';
    infoDiv.innerHTML = infoHTML;

    element.append(infoDiv);

    const infoModalDiv = document.createElement('DIV');
    infoModalDiv.className = 'modal_info';
    infoModalDiv.id = 'modal_info';
    infoModalDiv.innerHTML = infoModalHTML;
    element.append(infoModalDiv);


    const modal = document.querySelector('.modal_info');
    const openModalBtn = document.querySelector('#info');
    const closeModalBtn = document.querySelector('.button-modal');

    openModalBtn.onclick = function () {
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add('show'), 300);
    };


    closeModalBtn.onclick = function () {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = "none", 300);
    };
}