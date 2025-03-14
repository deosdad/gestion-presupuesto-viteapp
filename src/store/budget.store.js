import Expense from "../budget/models/Expense";
import Budget from "../budget/models/Budget";
import budgetDb from "./budget.db";
import showNotifiaction from "../budget/utils/Notifications/showNotification";

export const state = {
    expenses: [],
    budget: {
        initial: 0,
        remaining: 0
    }
}

const initStore = async() => {

    await budgetDb.openDB();
}

const loadStore = async () => {
   
    try {
        const [budgetFromDB, expensesDB] = await Promise.all([
            budgetDb.getBudgetDB(),
            budgetDb.getAllExpensesDB()
        ]);

        //Si no hay presupuesto no hay gastos
        if (!budgetFromDB) {
            return false; 
        }

        // Hay presupuesto pero no hay gastos
        if (budgetFromDB && !expensesDB) {
            return false; 
        }

        
        Object.assign(state, {
            budget: {
                initial: budgetFromDB.initial,
                remaining: budgetFromDB.remaining
            },
            expenses: expensesDB.map(({ id, name, amount, date }) => ({
                id, name, amount, date
            }))
        });
        
        return true; // Indica que todo salió bien

    } catch (error) {
        console.error("Error al cargar los datos desde IndexedDB:", error.message);
        return false;
    }
};

const addBudget = async(initial) => {
   
    const newBudget = new Budget(initial, initial);

    state.budget.initial = newBudget.initial;
    state.budget.remaining = newBudget.remaining;

    console.log(state.budget);

    await budgetDb.saveBudgetDB(state.budget);

    showNotifiaction('Añadido correctamente', 'success');

    return true;
};

const addExpense = async(name, amount, date) => {
    if (amount > state.budget.remaining) {
        return showNotifiaction("No tienes suficiente presupuesto", 'error');
    }

    const newExpense = new Expense(name, amount, date); 
    state.expenses.push(newExpense);
    calculateBudget();

    await budgetDb.saveExpenseDB(newExpense);
    showNotifiaction('Añadido correctamente', 'success');
    return true;
}

const deleteExpense = async(expenseId) => {
    const expenseIndex = state.expenses.findIndex(ex => ex.id === expenseId);
    

    if (expenseIndex !== -1) {

        state.expenses.splice(expenseIndex, 1);
        
        calculateBudget();
        
        await budgetDb.deleteExpenseDB(expenseId);
        
        showNotifiaction('Eliminado correctamente', 'success');
    } else {
        showNotifiaction('No se encontro el gasto con ID'+id, 'success');
    }
}
const editExpense = async(expenseId, newName, newAmount, newDate) => {
    const expenseIndex = state.expenses.findIndex(ex => ex.id === expenseId);
    
    state.expenses[expenseIndex].name = newName;
    state.expenses[expenseIndex].amount = newAmount;
    state.expenses[expenseIndex].date = newDate;

    calculateBudget();

    const newDataExpense = {
        name: newName,
        amount: newAmount,
        date: newDate,
        id: expenseId
    }

    await budgetDb.udateExpenseDB(expenseId,newDataExpense);

    showNotifiaction('Editado correctamente', 'success');
};

const calculateBudget = async() => {
    const remaining = state.budget.initial - state.expenses.reduce((total, expense) => total + expense.amount, 0);
    state.budget.remaining = remaining;
    await budgetDb.saveBudgetDB(state.budget);
}



const getExpenses = () => {
    return state.expenses;
}

export default {
    state,
    initStore,
    loadStore,
    addBudget,
    calculateBudget,
    addExpense,
    editExpense,
    deleteExpense,
    getExpenses
}