import budgetDb from "../../../store/budget.db";

const ElementId = {
    list: '#gastos'
}

export const addExpensesHTML = async(expenses) => {

    const expensesList = document.querySelector(ElementId.list);

    if (expensesList) {
        while (expensesList.firstChild) {
            expensesList.removeChild(expensesList.firstChild);
        }
    }

    expenses.forEach(expense => {
        const { name, amount, date, id } = expense;

        const expenseDiv = document.createElement('div');
        expenseDiv.className = 'lista__item';
        expenseDiv.dataset.id = id;
        expenseDiv.innerHTML = `
                <div class="lista__cantidad">
                    <p class="lista__moneda"><span class="lista__dinero">${amount}</span>
                    €</p>
                </div>
                <div class="lista__info">
                    <p class="lista__nombre">${name}</p>
                    <p class="lista__fecha">${date}</p>
                </div>
                <div class="lista__acciones">
                    <button class="button-red" data-id="${id}">X</button>
                    <button class="button-edit" data-id="${id}">🖉</button>
                </div>
            `;

            expensesList.appendChild(expenseDiv);
    });
}