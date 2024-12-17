const levels = [
    { category: 'General', name: 'Nivel 1', limit: 100000, rate: 0.10 },
    { category: 'General', name: 'Nivel 2', limit: 200000, rate: 0.15 },
    { category: 'General', name: 'Nivel 3', limit: 400000, rate: 0.20 },
    { category: 'General', name: 'Nivel 4', limit: 700000, rate: 0.30 },
    { category: 'General', name: 'Nivel 5', limit: 1000000, rate: 0.40 },
    { category: 'Otros', name: 'Contimarket', limit: 1000000, rate: 0.35 },
    { category: 'Otros', name: 'Tienda Naranja 20%', limit: 2000000, rate: 0.20 },
    { category: 'Otros', name: 'Tienda Naranja 25%', limit: 2000000, rate: 0.25 }
];

let dataJson = [];
let topeUsado = 0;

function formatNumber(number) {
    return number.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function parseEquation(equation) {
    return equation.split('+').map(line => {
        const [price, quantity = '1'] = line.split('*');
        const parsedPrice = parseFloat(price.trim());
        const parsedQuantity = parseFloat(quantity.trim());
        return {
            precioUnitario: isNaN(parsedPrice) ? 0 : parsedPrice,
            cantidad: isNaN(parsedQuantity) ? 0 : parsedQuantity,
            totalProducto: isNaN(parsedPrice) || isNaN(parsedQuantity) ? 0 : parsedPrice * parsedQuantity
        };
    });
}

function generateEquation() {
    return dataJson.map(item =>
        item.cantidad === 1 ? `${item.precioUnitario}` : `${item.precioUnitario}*${item.cantidad}`
    ).join('+');
}

function updateTable() {
    $('#resultTable tbody').empty();
    dataJson.forEach(item => {
        const row = $('<tr>')
            .append(`<td contenteditable='true' class="editable">${formatNumber(item.precioUnitario)}</td>`)
            .append(`<td contenteditable='true' class="editable">${formatNumber(item.cantidad)}</td>`)
            .append(`<td>${formatNumber(item.totalProducto)}</td>`);
        $('#resultTable tbody').append(row);
    });
    $('#calculatorInput').val(generateEquation());
    updateTotal();
}

function updateTotal() {
    const total = dataJson.reduce((sum, item) => sum + item.totalProducto, 0);
    $('#totalAmount').text(formatNumber(total));
    updateDiscountTable(total);
}

function updateDiscountTable(total) {
    const selectedOption = $('#levelSelect').val();
    const filteredLevels = selectedOption === 'all'
        ? levels
        : levels.filter(level => level.category === selectedOption.split('-')[1] || level.name === selectedOption);

    let tableHtml = '';
    filteredLevels.forEach(level => {
        const availableLimit = Math.max(level.limit - topeUsado, 0);
        const discount = Math.min(total, availableLimit) * level.rate;
        const finalAmount = total - discount;
        const exceedsLimit = total > availableLimit;
        tableHtml += `
            <tr >
                <td>${level.name}</td>
                <td>${(level.rate * 100)}%</td>
                <td ${exceedsLimit ? 'class="bg-danger"' : ''}>${formatNumber(finalAmount)}</td>
                <td>${formatNumber(discount)}</td>
            </tr>
        `;
    });
    $('#totalTable tbody').html(tableHtml);
}

function generateLevelSelect() {
    const categories = [...new Set(levels.map(level => level.category))];
    let selectHtml = '<option value="all">Todos</option>';
    categories.forEach(category => {
        selectHtml += `<optgroup label="${category}">`;
        selectHtml += `<option value="all-${category}">Todos ${category}</option>`;
        levels.filter(level => level.category === category).forEach(level => {
            selectHtml += `<option value="${level.name}">${level.name}</option>`;
        });
        selectHtml += '</optgroup>';
    });
    $('#levelSelect').html(selectHtml);
}

$(document).ready(function() {
    generateLevelSelect();

    $('#levelSelect').on('change', function() {
        updateTotal();
    });

    $('#calculatorInput').on('input', function() {
        let equation = $(this).val().replace(/[^0-9+*]/g, '');
        if (equation.endsWith('+') || equation.endsWith('*')) {
            equation += '0';
        }
        $(this).val(equation);
        dataJson = parseEquation(equation);
        updateTable();
    });

    $(document).on('blur', '.editable', function() {
        const rowIndex = $(this).closest('tr').index();
        const column = $(this).index();
        let newValue = parseFloat($(this).text().replace(/\./g, '').replace(',', '.'));

        if (isNaN(newValue)) {
            newValue = 0;
        }

        dataJson[rowIndex][column === 0 ? 'precioUnitario' : 'cantidad'] = newValue;
        dataJson[rowIndex].totalProducto = dataJson[rowIndex].precioUnitario * dataJson[rowIndex].cantidad;

        updateTable();
    });

    $('#exportCsv').on('click', function() {
        const date = new Date().toISOString().split('T')[0];
        const fileName = `compras-de-${date}.csv`;
        let csvContent = "Precio Unitario,Cantidad,Total Producto\n" +
            dataJson.map(item => `${item.precioUnitario},${item.cantidad},${item.totalProducto}`).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });

    $('.calc-key').on('click', function() {
        const key = $(this).data('key');
        let equation = $('#calculatorInput').val();

        if (key === 'C') {
            equation = equation.slice(0, -1);
        } else if (key === 'CE') {
            equation = '';
        } else {
            equation += key;
        }

        if (equation.endsWith('*') && !/[0-9]$/.test(equation)) {
            equation += '0';
        }

        $('#calculatorInput').val(equation).trigger('input');
    });

    $('#levelSelect').val('all-General').trigger('change');
    updateTable();

    $('#topeUsadoInput').on('input', function() {
        topeUsado = parseFloat($(this).val()) || 0;
        updateTotal();
    });
});

