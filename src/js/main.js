const levels = [
    { limit: 100000, rate: 0.10 },
    { limit: 200000, rate: 0.15 },
    { limit: 400000, rate: 0.20 },
    { limit: 700000, rate: 0.30 },
    { limit: 1000000, rate: 0.40 }
];

// Función para formatear los números con puntos como separadores de miles
function formatNumberWithDot(number) {
    return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calculateLevels(income) {
    return levels.map(level => {
        const discount = Math.min(income, level.limit) * level.rate;
        return income - discount;
    });
}

function updateTotalTable(total) {
    const totNiveles = calculateLevels(total);

    $("#total").text(formatNumberWithDot(total)); // Usar la función de formato

    totNiveles.forEach((value, index) => {
        const levelCell = $(`#level${index + 1}`);
        levelCell.text(formatNumberWithDot(value)); // Usar la función de formato

        // Aplicar color si excede el límite
        if (total > levels[index].limit) {
            levelCell.addClass('bg-danger');
        } else {
            levelCell.removeClass('bg-danger');
        }
    });
}

// Función para analizar la expresión y eliminar *1
function parseEquation(equation) {
    const lines = equation.split('+'); // Dividir la expresión por el símbolo +
    const parsedLines = [];

    lines.forEach(line => {
        const parts = line.split('*'); // Dividir por el símbolo *
        if (parts.length === 2) {
            const precioUnitario = parseFloat(parts[0].trim());
            const cantidad = parseFloat(parts[1].trim());
            if (isNaN(precioUnitario) || isNaN(cantidad)) {
                // Si alguno es NaN, asignamos 0
                parsedLines.push({
                    precioUnitario: 0,
                    cantidad: 0,
                    totalProducto: 0
                });
            } else {
                parsedLines.push({
                    precioUnitario: precioUnitario,
                    cantidad: cantidad,
                    totalProducto: precioUnitario * cantidad
                });
            }
        } else if (parts.length === 1) {
            const precioUnitario = parseFloat(parts[0].trim());
            if (isNaN(precioUnitario)) {
                // Si es NaN, asignamos 0
                parsedLines.push({
                    precioUnitario: 0,
                    cantidad: 1,
                    totalProducto: 0
                });
            } else {
                parsedLines.push({
                    precioUnitario: precioUnitario,
                    cantidad: 1,
                    totalProducto: precioUnitario
                });
            }
        }
    });

    return parsedLines;
}

// Función para generar la ecuación sin *1
function generateEquation() {
    let equation = dataJson.map(item => {
        // No mostrar *1 si la cantidad es 1
        if (item.cantidad === 1) {
            return `${item.precioUnitario}`;
        } else {
            return `${item.precioUnitario}*${item.cantidad}`;
        }
    }).join('+');

    return equation;
}

function updateTable() {
    $('#resultTable tbody').empty(); // Limpiar la tabla

    dataJson.forEach(item => {
        const row = $('<tr>')
            .append(`<td contenteditable='true' class="editable">${formatNumberWithDot(item.precioUnitario)}</td>`) // Usar la función de formato
            .append(`<td contenteditable='true' class="editable">${formatNumberWithDot(item.cantidad)}</td>`) // Usar la función de formato
            .append(`<td>${formatNumberWithDot(item.totalProducto)}</td>`); // Usar la función de formato
        $('#resultTable tbody').append(row);
    });

    // Actualizar la calculadora con la nueva ecuación
    $('#calculatorInput').val(generateEquation());

    // Actualizar el total
    updateTotal();
}

 // Función para actualizar el total
function updateTotal() {
    let total = 0;
    dataJson.forEach(item => {
        total += item.totalProducto;
    });

    updateTotalTable(total);

    $('#totalAmount').text(formatNumberWithDot(total)); // Usar la función de formato
}

$(document).ready(function () {
    let dataJson = []; // Aquí almacenamos el JSON
   
    
    // Validación para que la tabla solo acepte números
    $(document).on('blur', '.editable', function () {
        const rowIndex = $(this).closest('tr').index();
        const column = $(this).index();
        let newValue = $(this).text().replace(/\./g, ''); // Eliminar puntos para editar solo números
        newValue = parseFloat(newValue.replace(',', '.')); // Convertir a número

        if (isNaN(newValue)) {
            // Si el valor es NaN, lo cambiamos a 0
            dataJson[rowIndex][column === 0 ? 'precioUnitario' : 'cantidad'] = 0;
        } else {
            if (column === 0) {
                // Precio Unitario
                dataJson[rowIndex].precioUnitario = newValue;
            } else if (column === 1) {
                // Cantidad
                dataJson[rowIndex].cantidad = newValue;
            }
        }

        // Actualizar el total producto
        dataJson[rowIndex].totalProducto = dataJson[rowIndex].precioUnitario * dataJson[rowIndex].cantidad;

        updateTable(); // Refrescar la tabla y calculadora
    });

   

    // Manejo de selección de niveles
    $('#levelSelect').on('change', function () {
        const selectedLevel = $(this).val();

        if (selectedLevel === 'all') {
            $("#totalTable th, #totalTable td").show();
        } else {
            const levelIndex = parseInt(selectedLevel);
            $("#totalTable th, #totalTable td").hide();
            $("#totalTable th:nth-child(1), #totalTable td:nth-child(1)").show();
            $("#totalTable th:nth-child(" + (levelIndex + 1) + "), #totalTable td:nth-child(" + (levelIndex + 1) + ")").show();
        }
    });

    // Detectar cambios en el textarea de la calculadora
    $('#calculatorInput').on('input', function () {
        let equation = $(this).val();

        // Validar que solo sean números y los operadores + y *
        if (/[^0-9+\-*]/.test(equation)) {
            // Si hay caracteres no permitidos, eliminarlos
            equation = equation.replace(/[^0-9+\-*]/g, '');
            $(this).val(equation); // Actualizar el valor del textarea
        }

        // Si el último carácter es un operador y no hay número después, agregar un valor predeterminado
        if (equation.endsWith('+') || equation.endsWith('*')) {
            if (equation.endsWith('*')) {
                equation += '0'; // Agregar 0 después de *
            } else {
                equation += '0'; // Agregar 0 después de +
            }
            $(this).val(equation); // Actualizar el valor del textarea
        }

        if (!equation) return;

        try {
            // Analizar la ecuación y actualizar el JSON
            const parsedLines = parseEquation(equation);

            // Actualizar el JSON con los nuevos cálculos
            dataJson = parsedLines;
            updateTable(); // Refrescar la tabla con los nuevos valores
        } catch (e) {
            console.error('Error al procesar la ecuación:', e);
        }
    });

    // Detectar cuando se borra el valor predeterminado
    $('#calculatorInput').on('blur', function () {
        let equation = $(this).val();
        const lastChar = equation[equation.length - 1];

        // Si el último carácter es un operador y el siguiente es un número, quitar el valor predeterminado (0)
        if ((lastChar === '+' || lastChar === '*') && equation.length > 1) {
            // Si se está borrando el 0 después del operador, dejar solo el operador ( + o * )
            if (lastChar === '*') {
                equation = equation.slice(0, -1) + '*'; // Dejar solo *
            } else {
                equation = equation.slice(0, -1) + '+'; // Dejar solo +
            }
            $(this).val(equation); // Actualizar el valor del textarea
        }
    });

    // Actualizar la tabla inicialmente
    updateTable();

    // Exportar CSV con nombre personalizado
    $('#exportCsv').on('click', function () {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('es-ES').split('/').reverse().join('-');
        const fileName = `compras-de-${formattedDate}.csv`;

        let csvContent = "Precio Unitario,Cantidad,Total Producto\n";
        dataJson.forEach(item => {
            csvContent += `${item.precioUnitario},${item.cantidad},${item.totalProducto}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });

    // Manejo del teclado virtual
    $(document).on('click', '.calc-key', function () {
        const key = $(this).data('key');
        let equation = $('#calculatorInput').val();

        if (key === 'C') {
            // Borrar el último carácter
            equation = equation.slice(0, -1);
        } else if (key === 'CE') {
            // Borrar todo
            equation = '';
        } else if (key === '000') {
            // Agregar 000
            equation += '000';
        } else {
            equation += key; // Agregar el número o operador al final
        }

        // Si el operador es * y no hay número después, agregar un 0
        if (equation.endsWith('*') && !/[0-9]$/.test(equation)) {
            equation += '0'; // Agregar 0 después del *
        }

        $('#calculatorInput').val(equation); // Actualizar el textarea
        // Actualizar la tabla y el total
        try {
            const parsedLines = parseEquation(equation);
            dataJson = parsedLines;
            updateTable();
        } catch (e) {
            console.error('Error al procesar la ecuación:', e);
        }
    });
});
