import showNotifiaction from "../Notifications/showNotification";

const Notifications = {
    error_all: 'No puede estar vacio',
    add: 'Añadido correctamente',
    not_number: 'Nombre no puede ser un número',
    number: 'Presupuesto tiene que ser un número',
    positive: 'Presupuesto tiene que ser superior a 0'
};

const validateBudget = (initial) => {
    if (!initial) return showNotifiaction(Notifications.number, 'error');
    if (isNaN(initial)) return showNotifiaction(Notifications.number, 'error');
    if (initial <= 0) return showNotifiaction(Notifications.positive, 'error');
    
    return true; // Sin errores
};

export default validateBudget;