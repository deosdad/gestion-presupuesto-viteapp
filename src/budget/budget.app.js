import budgetDb from '../store/budget.db';
import budgetStore from '../store/budget.store';
import html from './budget.app.html?raw'
import { renderBudget } from './presentation/render-budget/render-budget';
import { renderExpensesList } from './presentation/render-expenses-list/render-expenses-list';
import { renderExpenseForm } from './presentation/render-form/render-form';
import { renderInfo } from './presentation/render-info/render-info';
import { renderModal } from './presentation/render-modal/render-modal';
import { addBudgetHTML } from './utils/budget/addBudgetHTML';
import { downloadJSON } from './utils/csv/downloadCSV';
import { addExpensesHTML } from './utils/expenses/addExpensesHTML';
import { showModal } from './utils/modal/showModal';
import showNotifiaction from './utils/Notifications/showNotification';
import validateExpense from './utils/validations/expenseValidation';

const ElementId = {
    leftLayout: '#layout1',
    rightLayout: '#layout2',
    expensesList: '#gastos',
    form: '#agregar-gasto',
    name: '#gasto',
    amount: '#cantidad',
    date: '#fecha',
    btnSubmit: '.gasto__button',
    deleteDB: '#deleteDB',
    download: '#descargar'
}

/**
 * 
 * 
 * @param {HTMLDivElement} element 
 */
export const BudgetApp = async (element) => {
    
    let updateID = null;
    
    (() => {
        
        const app = document.createElement('div');
        app.innerHTML = html;
        element.append(app);

        const divLeftLayout = element.querySelector(ElementId.leftLayout);
        const divRightLayout = element.querySelector(ElementId.rightLayout);

        renderExpenseForm(divLeftLayout);
        renderBudget(divLeftLayout);
        renderInfo(divLeftLayout);
        renderExpensesList(divRightLayout);
        renderModal(element);
    })();
    await budgetStore.initStore();
    //referencias DOM
    const expenseForm = element.querySelector(ElementId.form);
    const expenseName = element.querySelector(ElementId.name);
    const expenseAmount = element.querySelector(ElementId.amount);
    const expenseDate = element.querySelector(ElementId.date);
    const btnAddExpense = element.querySelector(ElementId.btnSubmit);

    const hasBudget = await budgetDb.getBudgetDB();
    await showModal(hasBudget);

    //eventos
    expenseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const inputName = expenseName.value;
        const inputAmount = Number(expenseAmount.value);
        const inputDate = expenseDate.value;
        const validationError = validateExpense(inputName, inputAmount, inputDate);

        if (!validationError) return;

        if(updateID){
            await budgetStore.editExpense(updateID, inputName, inputAmount, inputDate);
            updateID = null;
            btnAddExpense.textContent = 'Agregar Gasto';
        }else{
            await budgetStore.addExpense(inputName, inputAmount, inputDate);
        }
        expenseForm.reset();
        updateDOM();
    });

    const expensesList = element.querySelector(ElementId.expensesList); 
    expensesList.addEventListener('click', async (event) => {
        if (event.target.classList.contains('button-red')) {

            await budgetStore.deleteExpense(event.target.dataset.id);
            updateDOM();
        }
        if (event.target.classList.contains('button-edit')) {
            const id = event.target.dataset.id;

            const {name, amount, date} = await budgetDb.getExpenseDB(id);
            
            expenseName.value = name;
            expenseAmount.value = amount;
            expenseDate.value = date;
            updateID = id;

            btnAddExpense.textContent = 'Editar';
        }
    });

    const btnDeleteDB = element.querySelector(ElementId.deleteDB); 
    btnDeleteDB.addEventListener('click', async () => {
    
        const confirmation = window.confirm("¿Estás seguro de que quieres eliminar la base de datos? Esta acción no se puede deshacer. Se recargara la web automaticamente.");

        if (confirmation) {

            await budgetDb.deleteDatabase();
            
        } else {
            console.log("La eliminación fue cancelada.");
        }
    });

    const btnDownloadCSV = document.querySelector(ElementId.download); 
    btnDownloadCSV.addEventListener('click', async () => {
        try {
            const dataBudget = budgetStore.state.budget;
            const dataExpenses = budgetStore.state.expenses; 

            if (dataBudget && dataExpenses && dataExpenses.length > 0) {
                
                downloadJSON(dataBudget, dataExpenses); 
            } else {
                showNotifiaction("No hay datos disponibles para exportar.", 'error');
            }
        } catch (error) {
            showNotifiaction("Error al obtener los datos para CSV.", 'error');
        }
    });
}

export const updateDOM = () => {
    addBudgetHTML();
    const expenses = budgetStore.getExpenses();
    addExpensesHTML(expenses);
}