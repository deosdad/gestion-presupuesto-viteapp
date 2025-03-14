

export const downloadJSON = (dataBudget, dataExpenses, filename = 'presupuesto.json') => {
    const formattedData = {
        presupuesto: {
            inicial: dataBudget.initial,
            restante: dataBudget.remaining
        },
        gastos: dataExpenses.map(({ id, name, amount, date }) => ({
            nombre: name,  
            cantidad: amount,  
            fecha: date      
        }))
    };

    const jsonString = JSON.stringify(formattedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
};

