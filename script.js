function checkPalindrome() {
    const str = document.getElementById('palindrome-input').value;
    const result = palindrome(str);
    document.getElementById('palindrome-result').innerText = result ? "Es un palíndromo." : "No es un palíndromo.";
}

function convertRoman() {
    const num = parseInt(document.getElementById('roman-input').value, 10);
    const result = convertToRoman(num);
    document.getElementById('roman-result').innerText = `Número romano: ${result}`;
}

function decodeRot13() {
    const str = document.getElementById('rot13-input').value;
    const result = rot13(str);
    document.getElementById('rot13-result').innerText = `Texto decodificado: ${result}`;
}

function checkPhone() {
    const str = document.getElementById('phone-input').value;
    const result = telephoneCheck(str);
    document.getElementById('phone-result').innerText = result ? "Número válido." : "Número no válido.";
}

function checkRegister() {
    const price = parseFloat(document.getElementById('cash-price').value);
    const cash = parseFloat(document.getElementById('cash-paid').value);
    const cid = JSON.parse(document.getElementById('cash-cid').value);
    const result = checkCashRegister(price, cash, cid);
    document.getElementById('cash-result').innerText = `Estado: ${result.status}\nCambio: ${JSON.stringify(result.change)}`;
}

// Funciones originales:
// 1. Palindrome Checker
function palindrome(str) {
    str = str.toLowerCase().replace(/[\W_]/g, ''); // Convertimos el string a minúsculas eliminando caracteres no alfanuméricos y guiones bajos
    const reversed = str.split('').reverse().join(''); // Lo separamos en letras, revertimos el array y lo volvemos a unir
    return str === reversed; // Si el string original es igual a su versión revertida, devuelve true, de lo contrario, devuelve false
}

// 2. Roman Number Converter
function convertToRoman(num) {
    const romanNums = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ]; // Array de objetos con los símbolos
    let result = ''; // Resultado en números romanos
    for (let i = 0; i < romanNums.length; i++) {
        while (num >= romanNums[i].value) { // Si el valor cabe en el número
            result += romanNums[i].symbol; // Añadimos el símbolo al resultado
            num -= romanNums[i].value; // Restamos el valor del número
        }
    }
    return result;
}

// 3. ROT13 Converter
function rot13(str) {
    let result = ''; // Variable donde almacenaremos el resultado
    for (let i = 0; i < str.length; i++) { // Iteramos los caracteres del string pasado
        let char = str[i];
        if (/[A-Z]/.test(char)) { // Si es una letra
            let asciiValue = char.charCodeAt(0); // Obtenemos valor ASCII
            let rotValue = ((asciiValue - 65 + 13) % 26) + 65; // Aplicamos ROT13
            result += String.fromCharCode(rotValue); // Convierte de nuevo a letra
        } else {
            result += char; // Mantenemos caracteres alfanuméricos
        }
    }
    return result;
}

// 4. US Phone Check
function telephoneCheck(str) {
    const regex = /^(1\s?)?(\(\d{3}\)|\d{3})([\s\-]?)\d{3}([\s\-]?)\d{4}$/;
    if (!regex.test(str)) return false; // Comprobamos si el formato es válido con la regex
    const digits = str.replace(/[^\d]/g, ''); // Eliminamos los caracteres no numéricos
    return digits.length === 10 || (digits.length === 11 && digits[0] === '1'); // Verificamos que el número tenga 10 dígitos o 11 si comienza con '1'
}

// 5. Cash Register
function checkCashRegister(price, cash, cid) {
    const currencyUnit = [
        ["PENNY", 0.01],
        ["NICKEL", 0.05],
        ["DIME", 0.1],
        ["QUARTER", 0.25],
        ["ONE", 1],
        ["FIVE", 5],
        ["TEN", 10],
        ["TWENTY", 20],
        ["ONE HUNDRED", 100]
    ];
    let changeDue = cash - price; // Calculamos el cambio que se debe devolver
    let totalCashInDrawer = 0; // Calculamos el total disponible en la caja
    for (let i = 0; i < cid.length; i++) {
        totalCashInDrawer += cid[i][1];
    }
    if (totalCashInDrawer < changeDue) { // Si no hay suficiente dinero en la caja
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }
    if (totalCashInDrawer === changeDue) { // Si el total en la caja es igual al cambio debido
        return { status: "CLOSED", change: cid };
    }
    let change = []; // Intentar dar el cambio con las monedas y billetes disponibles
    for (let i = currencyUnit.length - 1; i >= 0; i--) {
        const [unit, value] = currencyUnit[i];
        let amountInDrawer = cid[i][1];
        let amountToGive = 0;
        while (changeDue >= value && amountInDrawer > 0) { // Mientras haya suficiente cambio en la caja y aún no se haya dado todo el cambio
            amountToGive += value;
            amountInDrawer -= value;
            changeDue -= value;
            changeDue = Math.round(changeDue * 100) / 100; // Redondeamos a dos decimales
        }
        if (amountToGive > 0) { // Si se dio alguna cantidad de esa denominación, añadir al resultado
            change.push([unit, amountToGive]);
            cid[i][1] = amountInDrawer; // Actualizamos el valor restante en la caja
        }
    }
    if (changeDue > 0) { // Si después de intentar dar el cambio sigue habiendo cambio pendiente
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }
    return { status: "OPEN", change: change }; // Devolvemos el cambio en el formato correcto (de mayor a menor denominación)
}
