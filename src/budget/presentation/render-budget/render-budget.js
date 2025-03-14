import budgetHTML from './render-budget.html?raw';

export const renderBudget = async(element) => {

    const budgetDiv = document.createElement('DIV');
    budgetDiv.className = 'presupuesto';
    budgetDiv.innerHTML = budgetHTML;

    element.append(budgetDiv);
}
