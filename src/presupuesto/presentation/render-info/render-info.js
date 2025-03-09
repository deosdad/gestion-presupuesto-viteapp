import presupuestoDb from '../../store/presupuesto-db';
import infoHTML from './render-info.html?raw';
import infoModalHTML from './render-modal-info.html?raw';
const ElementIDs = {
    presupuestoTotal: '#total',
    presupuestoRestante: '#restante'

}


export const renderInfo = async (element) => {

    const infoDiv = document.createElement('DIV');
    infoDiv.className = 'info';
    infoDiv.id = 'presupuesto';
    infoDiv.innerHTML = infoHTML;

    element.append(infoDiv);

    const infoModalDiv = document.createElement('DIV');
    infoModalDiv.className = 'modal_info';
    infoModalDiv.id = 'modal_info';
    infoModalDiv.innerHTML = infoModalHTML;
    element.append(infoModalDiv);


    const modal = document.querySelector('.modal_info');
    const openModalBtn = document.querySelector('#info');
    const closeModalBtn = document.querySelector('.button-modal');

    openModalBtn.onclick = function () {
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add('show'), 300);
    };


    closeModalBtn.onclick = function () {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = "none", 300);
    };

    const botonEliminar = document.querySelector('#deleteDB');  // Asegúrate de que este elemento exista en el HTML

    botonEliminar.addEventListener('click', async () => {
        // Confirmación antes de eliminar
        const confirmation = window.confirm("¿Estás seguro de que quieres eliminar la base de datos? Esta acción no se puede deshacer. Se recargara la web automaticamente.");

        if (confirmation) {

            await presupuestoDb.eliminarBaseDeDatos(); // Llamada a la función de eliminación
            
        } else {
            console.log("La eliminación fue cancelada.");
        }
    });

    const generarCSV = (datosPresupuesto, datosGasto) => {
        // Agregar los headers para los gastos
        const headers = ['descripcion', 'cantidad', 'fecha'];
    
        // Mapear los gastos para incluir solo los valores necesarios (sin el id)
        const rows = datosGasto.map(item => {
            return [
                item.nombre,    // Descripción del gasto
                item.cantidad,  // Monto del gasto
                item.fecha      // Fecha del gasto
            ].join(',');
        });
    
        // Primero añadimos una fila con el presupuesto y el restante
        const presupuestoRow = [`Presupuesto inicial: ${datosPresupuesto.presupuesto}`, `Presupuesto restante: ${datosPresupuesto.restante}`];
    
        // Luego unimos la fila del presupuesto y el restante con los headers y las filas de los gastos
        const csvContent = [
            presupuestoRow.join(','),  // Fila con los valores de presupuesto
            headers.join(','),         // Encabezados de los gastos
            ...rows                    // Filas de los gastos
        ].join('\n');
    
        return csvContent;
    };
    


    const descargarCSV = (datosPresupuesto, datosGasto) => {
        const csvContent = generarCSV(datosPresupuesto, datosGasto);

        // Crear un Blob con el contenido CSV y tipo MIME
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Crear un enlace para descargar el archivo CSV
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'presupuesto_gastos.csv';  // Nombre del archivo CSV

        // Simular el clic en el enlace para descargar
        link.click();

        // Liberar el objeto URL
        URL.revokeObjectURL(url);
    };

    // Evento de botón para descargar el CSV
    const botonDescargar = document.querySelector('#descargar');  // Asegúrate de que este elemento exista en el HTML
    botonDescargar.addEventListener('click', async () => {
        try {
            const datosPresupuesto = await presupuestoDb.obtenerPresupuestoDB(); // Obtener presupuesto
            const datosGasto = await presupuestoDb.obtenerTodosLosGastosDB();    // Obtener los gastos

            // Verificar si los datos existen y si hay gastos disponibles
            if (datosPresupuesto && datosGasto && datosGasto.length > 0) {
                descargarCSV(datosPresupuesto, datosGasto);  // Llamar a la función para descargar el archivo CSV
            } else {
                alert("No hay datos disponibles para exportar.");
            }
        } catch (error) {
            console.error("Error al obtener los datos para CSV:", error);
        }
    });


}



