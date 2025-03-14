import Budget from "../budget/models/Budget";

const dbName = 'Buget-App';
const version = 1;
const database = {
    db: null
}

const openDB = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = (e) => { 
            const db = e.target.result;

            // Crear el almacén de objetos para los gastos
            const objectStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: false });
            objectStore.createIndex('name', 'name', { unique: false });
            objectStore.createIndex('amount', 'amount', { unique: false });
            objectStore.createIndex('date', 'date', { unique: false });

            // Crear el almacén de objetos para el presupuesto
            const presupuestoStore = db.createObjectStore('budget', { keyPath: 'id', autoIncrement: true });
            presupuestoStore.createIndex('initial', 'initial', { unique: true });
            presupuestoStore.createIndex('remaining', 'remaining', { unique: false });
        };

        request.onsuccess = (event) => {
            database.db = event.target.result;
            resolve(database.db);
        };

        request.onerror = () => {
            reject('Error al abrir la base de datos');
        };
    });
};

const getBudgetDB = async () => {
    if (!database.db) {
        console.error('La base de datos no está abierta.');
        return;
    }

    const transaction = database.db.transaction('budget', 'readonly');
    const objectStore = transaction.objectStore('budget');
    const request = objectStore.get(1);

    return new Promise((resolve, reject) => {
        request.onsuccess = (e) => {
           
            resolve(e.target.result || false);
        };

        request.onerror = (e) => {
            reject('No se pudo obtener el presupuesto');
        };
    });
};

const saveBudgetDB = async (budget) => {
    return new Promise((resolve, reject) => {
        if (!database.db) {
            reject('La base de datos no está abierta.');
            return;
        }

        const transaction = database.db.transaction('budget', 'readwrite');
        const objectStore = transaction.objectStore('budget');
        const requestGet = objectStore.get(1);

        requestGet.onsuccess = () => {
            const existingBudget = requestGet.result;

            if (existingBudget) {
                existingBudget.remaining = budget.remaining; // Solo actualizamos el restante

                const requestUpdate = objectStore.put(existingBudget);

                requestUpdate.onsuccess = () => console.log('Presupuesto actualizado correctamente.');
                requestUpdate.onerror = () => reject('Error al actualizar el presupuesto.');
            } else {
                budget.id = 1;
                const requestAdd = objectStore.add(budget);

                requestAdd.onsuccess = () => console.log('Presupuesto agregado correctamente.');
                requestAdd.onerror = () => reject('Error al agregar el presupuesto.');
            }
        };

        requestGet.onerror = () => reject('No se pudo obtener el presupuesto');

        transaction.oncomplete = () => {
            console.log('Transacción completada con éxito.');
            resolve('Operación realizada con éxito');
        };

        transaction.onerror = () => reject('Error en la transacción');
    });
};

const saveExpenseDB = async(expense) => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('expenses', 'readwrite');
        const objectStore = transaction.objectStore('expenses');
        const request = objectStore.add(expense);

        request.onsuccess = () => {
            resolve('Gasto agregado correctamente');
        };

        request.onerror = (e) => {
            reject('No se pudo agregar el gasto');
        };
    });
}

const udateExpenseDB = async(id, dataUpdate) => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('expenses', 'readwrite');
        const objectStore = transaction.objectStore('expenses');
        const request = objectStore.get(id);

        request.onsuccess = (e) => {
            const expense = e.target.result;
            if (expense) {
                // Actualizar con los nuevos datos
                const updatedExpense = { ...expense, ...dataUpdate };
                const updateRequest = objectStore.put(updatedExpense);
                updateRequest.onsuccess = () => resolve('Gasto actualizado correctamente');
                updateRequest.onerror = (error) => reject('No se pudo actualizar el gasto');
            } else {
                reject('Gasto no encontrado');
            }
        };

        request.onerror = (e) => {
            reject('Error al obtener el gasto para actualizar');
        };
    }); 
}

const deleteExpenseDB = (id) => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('expenses', 'readwrite');
        const objectStore = transaction.objectStore('expenses');
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            resolve('Gasto eliminado correctamente');
        };

        request.onerror = (e) => {
            reject('No se pudo eliminar el gasto');
        };
    });
}

const getAllExpensesDB = async() => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('expenses', 'readonly');
        const objectStore = transaction.objectStore('expenses');
        const request = objectStore.getAll();

        request.onsuccess = (e) => {
            resolve(e.target.result);
        };

        request.onerror = (e) => {
            console.error('Error al obtener los gastos', e);
            reject('No se pudieron obtener los gastos');
        };
    });
}

const deleteDatabase = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName); 

        request.onsuccess = () => {
            resolve('Base de datos eliminada correctamente');
        };

        request.onerror = (e) => {
            reject('No se pudo eliminar la base de datos');
        };

        request.onblocked = () => {
           
            window.location.reload();
        };
    });
};

const getExpenseDB = async (id) => {
    if (!database.db) {
        await openDB();  // Esperamos a que se abra la base de datos
    }

    if (!database.db) {
        return false;
    }

    const transaction = database.db.transaction('expenses', 'readonly');
    const objectStore = transaction.objectStore('expenses');
    const request = objectStore.get(id);

    return new Promise((resolve, reject) => {
        request.onsuccess = (e) => {
            resolve(e.target.result || false);
        };

        request.onerror = () => {
            reject('No se pudo obtener el presupuesto');
        };
    });
};



export default {
    openDB,
    getBudgetDB,
    saveBudgetDB,
    saveExpenseDB,
    udateExpenseDB,
    deleteExpenseDB,
    getAllExpensesDB,
    getExpenseDB,
    deleteDatabase,
}