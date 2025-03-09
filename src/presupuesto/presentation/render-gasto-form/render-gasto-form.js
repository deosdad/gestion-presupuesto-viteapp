import Gasto from '../../models/Gasto';
import presupuestoDb from '../../store/presupuesto-db';
import { insertarGastosLista } from '../render-gasto-lista/render-gasto-lista';
import { insertarPresupuesto } from '../render-presupuesto/render-presupuesto';
import formGastoHTML from './render-gasto-form.html?raw';
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Mensajes = {
    error_all: 'Todos los campos son obligatorios',
    add: 'Añadido correctamente',
    not_number: 'Nombre no puede ser un número',
    number: 'Cantidad tiene que ser un número',
    positive: 'Cantidad tiene que ser superior a 0'
};

const ElementIDs = {
    nombre: '#gasto',
    monto: '#cantidad',
    fecha: '#fecha',
    id: '#id',
    form: '#agregar-gasto'
};

let formGasto;
let maxNotifications = 1; 
let notificationCount = 0;

export const renderGastoForm = async (element) => {
    formGasto = document.createElement('DIV');
    formGasto.className = 'gasto sombras';
    formGasto.innerHTML = formGastoHTML;
    element.append(formGasto);
    await setupFormEventListeners();
};

const setupFormEventListeners = async () => {
    const formulario = formGasto.querySelector(ElementIDs.form);
    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();
        await handleSubmit(formulario);
    });
};

const handleSubmit = async (formulario) => {
    const submitText = formulario.querySelector('button[type="submit"]').textContent;
    const nombre = formulario.querySelector(ElementIDs.nombre).value;
    const cantidad = Number(formulario.querySelector(ElementIDs.monto).value);
    const fecha = formulario.querySelector(ElementIDs.fecha).value;

    if (!validar(nombre, cantidad, fecha)) return;

    if (submitText === 'Editar') {
        await actualizarGasto(formulario, nombre, cantidad, fecha);
    } else {
        await agregarNuevoGasto(nombre, cantidad, fecha);
    }

    await actualizarUI(formulario);
};

const actualizarGasto = async (formulario, nombre, cantidad, fecha) => {
    const id = formulario.querySelector(ElementIDs.id).value;
    const datosActualizados = { nombre, cantidad, fecha, id };
    await presupuestoDb.actualizarGastoDB(id, datosActualizados);
    formulario.querySelector('button[type="submit"]').textContent = 'Agregar';
};

const agregarNuevoGasto = async (nombre, cantidad, fecha) => {
    const gasto = new Gasto(nombre, cantidad, fecha);
    await presupuestoDb.guardarGastoDB(gasto);
};

const actualizarUI = async (formulario) => {
    await insertarGastosLista();
    await insertarPresupuesto();
    formulario.reset();
    mostrarMensaje(Mensajes.add, 'success');
};

const validar = (nombre, cantidad, fecha) => {
    if (!nombre && !cantidad && !fecha) return mostrarMensaje(Mensajes.error_all, 'error');
    if (Number(nombre)) return mostrarMensaje(Mensajes.not_number, 'error');
    if (cantidad <= 0) return mostrarMensaje(Mensajes.positive, 'error');
    if (isNaN(cantidad)) return mostrarMensaje(Mensajes.number, 'error');
    if (!nombre || !cantidad || !fecha) return mostrarMensaje(Mensajes.error_all, 'error');

    return true;
};

export const mostrarMensaje = (mensaje, tipo) => {

    if (notificationCount < maxNotifications) {
        notificationCount++;

        Toastify({
            text: mensaje,
            duration: 1000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                boxShadow: 'none',
                background: tipo === "success" ? "#009933" : "#cc0000",
                color: "white",
            },
        }).showToast();

        setTimeout(() => {
            notificationCount--; 
        }, 2000);
    }
};
