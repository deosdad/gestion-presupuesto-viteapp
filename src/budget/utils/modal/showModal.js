import budgetStore from "../../../store/budget.store";
import { updateDOM } from "../../budget.app";
import { hideDivModal, showDivModal } from "../../presentation/render-modal/render-modal";
import validateBudget from "../validations/budgetValidation";


const ElementId = {
    modal: '#modal-presupuesto',
    input: '#presupuesto-input',
}

export const showModal = async(hasBudget) => {

    if (!hasBudget) {

        showDivModal();

        const modalDiv = document.querySelector(ElementId.modal);
        const inputBudget = document.querySelector(ElementId.input);
        const form = modalDiv.querySelector('form');
        form.addEventListener('submit', async(event) => {
            event.preventDefault();

            console.log('2.2-Comprobar presupuesto');
            const budget = Number(inputBudget.value);
            const isValid = validateBudget(budget);
            await budgetStore.addBudget(budget);
            
            if (!isValid) return;

            hideDivModal();
            form.reset();
            updateDOM();
        })
    }else{
        await budgetStore.loadStore();
        updateDOM();
    }
}