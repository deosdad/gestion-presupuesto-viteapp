import expenseFormHTML from './render-form.html?raw';

export const renderExpenseForm = async (element) => {
    const expenseForm = document.createElement('DIV');
    expenseForm.className = 'gasto sombras';
    expenseForm.innerHTML = expenseFormHTML;
    element.append(expenseForm);
};
