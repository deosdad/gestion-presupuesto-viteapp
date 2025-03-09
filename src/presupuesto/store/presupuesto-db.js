const dbName = 'Presupuesto-App';
const version = 1;
const database = {
    db: null
}

const openDB = async () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = (e) => { // ⬅️ Aquí lo movemos
            const db = e.target.result;

            // Crear el almacén de objetos para los gastos
            const objectStore = db.createObjectStore('gastos', { keyPath: 'id', autoIncrement: false });
            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('cantidad', 'cantidad', { unique: false });
            objectStore.createIndex('fecha', 'fecha', { unique: false });

            // Crear el almacén de objetos para el presupuesto
            const presupuestoStore = db.createObjectStore('presupuesto', { keyPath: 'id', autoIncrement: true });
            presupuestoStore.createIndex('presupuesto', 'presupuesto', { unique: true });
            presupuestoStore.createIndex('restante', 'restante', { unique: false });
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


const obtenerPresupuestoDB = async () => {
    if (!database.db) {
        await openDB();  // Esperamos a que se abra la base de datos
    }

    if (!database.db) {
        return false;
    }

    const transaction = database.db.transaction('presupuesto', 'readonly');
    const objectStore = transaction.objectStore('presupuesto');
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

const obtenerGastoIDDB = async (id) => {
    if (!database.db) {
        await openDB();  // Esperamos a que se abra la base de datos
    }

    if (!database.db) {
        return false;
    }

    const transaction = database.db.transaction('gastos', 'readonly');
    const objectStore = transaction.objectStore('gastos');
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

const guardarPresupuestoDB = async (presupuesto) => {
    return new Promise((resolve, reject) => {
        if (!database.db) {
            reject('La base de datos no está abierta.');
            return;
        }

        const transaction = database.db.transaction('presupuesto', 'readwrite');
        const objectStore = transaction.objectStore('presupuesto');

        let presupuestoJSON;
        try {
            presupuestoJSON = typeof presupuesto.toJSON === 'function' ? presupuesto.toJSON() : presupuesto;
            if (isNaN(presupuestoJSON.presupuesto) || isNaN(presupuestoJSON.restante)) {
                throw new Error("El presupuesto y restante deben ser números válidos.");
            }
        } catch (error) {
            reject('Error en la validación de presupuesto');
            return;
        }

        const requestGet = objectStore.get(1);

        requestGet.onsuccess = () => {
            const existingPresupuesto = requestGet.result;

            if (existingPresupuesto) {
                // Si ya existe el presupuesto, actualizamos el restante
                existingPresupuesto.restante = presupuestoJSON.restante; // Solo actualizamos el restante

                const requestUpdate = objectStore.put(existingPresupuesto);

                requestUpdate.onsuccess = () => resolve(requestUpdate);
                requestUpdate.onerror = () => reject(requestUpdate);
            } else {
                // Si no existe el presupuesto, lo agregamos
                presupuestoJSON.id = 1;
                const requestAdd = objectStore.add(presupuestoJSON);

                requestAdd.onsuccess = () => resolve(requestAdd);
                requestAdd.onerror = () => reject(requestAdd);
            }
        };

        requestGet.onerror = () => reject('No se pudo obtener el presupuesto');
        transaction.onerror = () => reject('Error en la transacción');
    });
};


const guardarGastoDB = async(gasto) => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('gastos', 'readwrite');
        const objectStore = transaction.objectStore('gastos');
        const request = objectStore.add(gasto);

        request.onsuccess = () => {
            resolve('Gasto agregado correctamente');
        };

        request.onerror = (e) => {
            console.error('Error al agregar gasto', e);
            reject('No se pudo agregar el gasto');
        };
    });
}

const obtenerTodosLosGastosDB = async() => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('gastos', 'readonly');
        const objectStore = transaction.objectStore('gastos');
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

const eliminarGastoDB = (id) => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('gastos', 'readwrite');
        const objectStore = transaction.objectStore('gastos');
        const request = objectStore.delete(id);

        request.onsuccess = () => {
            resolve('Gasto eliminado correctamente');
        };

        request.onerror = (e) => {
            console.error('Error al eliminar gasto', e);
            reject('No se pudo eliminar el gasto');
        };
    });
}

const actualizarGastoDB = async(id, datosActualizados) => {
    return new Promise((resolve, reject) => {
        const transaction = database.db.transaction('gastos', 'readwrite');
        const objectStore = transaction.objectStore('gastos');
        const request = objectStore.get(id);

        request.onsuccess = (e) => {
            const gasto = e.target.result;
            if (gasto) {
                // Actualizar con los nuevos datos
                const updatedGasto = { ...gasto, ...datosActualizados };
                const updateRequest = objectStore.put(updatedGasto);
                updateRequest.onsuccess = () => resolve('Gasto actualizado correctamente');
                updateRequest.onerror = (error) => reject('No se pudo actualizar el gasto');
            } else {
                reject('Gasto no encontrado');
            }
        };

        request.onerror = (e) => {
            console.error('Error al obtener el gasto para actualizar', e);
            reject('Error al obtener el gasto para actualizar');
        };
    }); 
}

const eliminarBaseDeDatos = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.deleteDatabase(dbName); // Utiliza el mismo nombre que usas para abrir la base de datos

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


export default {
    openDB,
    obtenerPresupuestoDB,
    guardarPresupuestoDB,
    guardarGastoDB,
    obtenerTodosLosGastosDB,
    eliminarGastoDB,
    actualizarGastoDB,
    obtenerGastoIDDB,
    eliminarBaseDeDatos
}