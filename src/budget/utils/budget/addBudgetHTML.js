import budgetDb from "../../../store/budget.db";
import budgetStore from "../../../store/budget.store";

const ElementId = {
    initial: '#total',
    remaining: '#restante'
}

export const addBudgetHTML = async() => {

    const spanInitial = document.querySelector(ElementId.initial);
    const spanRemaining = document.querySelector(ElementId.remaining);

    const { initial, remaining } = budgetStore.state.budget;

    spanInitial.textContent = initial;
    spanRemaining.textContent = remaining;

    spanRemaining.classList.remove('green', 'orange', 'red');

    if (remaining <= initial / 4) {
        spanRemaining.classList.add('red');
    } else if (remaining <= initial / 2) {
        spanRemaining.classList.add('orange');
    } else {
        spanRemaining.classList.add('green');
    }
}