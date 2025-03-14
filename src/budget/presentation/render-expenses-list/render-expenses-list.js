import listaGastosHTML from './render-expenses-list.html?raw';

export const renderExpensesList = (element) => {

    const expensesList = document.createElement('DIV');
    expensesList.className = 'lista sombras-fixed';
    expensesList.innerHTML = listaGastosHTML;

    element.append(expensesList);
}