import showNotifiaction from "../Notifications/showNotification";

const Notifications = {
    error_all: 'Todos los campos son obligatorios',
    add: 'Añadido correctamente',
    not_number: 'Nombre no puede ser un número',
    number: 'Cantidad tiene que ser un número',
    positive: 'Cantidad tiene que ser superior a 0'
};

const validateExpense = (name, amount, date) => {
    if (!name && !amount && !date) return showNotifiaction(Notifications.error_all, 'error');
    if (Number(name)) return showNotifiaction(Notifications.not_number, 'error');
    if (isNaN(amount)) return showNotifiaction(Notifications.number, 'error');
    if (amount <= 0) return showNotifiaction(Notifications.positive, 'error');
    if(!date) return showNotifiaction(Notifications.error_all, 'error');
    if(!name) return showNotifiaction(Notifications.error_all, 'error');
    return true; // Sin errores
};

export default validateExpense;