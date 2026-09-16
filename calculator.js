// Set 'screen' variable
const calculatorScreen = document.querySelector('#calculator-screen');
// Limit input to 14 chars for screen
const charLimit = 14;

// Adds inputs to screen to display on calculator
function screenDisplay(input, type='add') {
    // Screen types
    // add -> just add input to screen
    // new -> override screen with new input
    // solution -> new calculated solution
    // Show '0' if there is no input

    const currentDisplay = calculatorScreen.innerHTML;

    // Prevent any inputs over limit
    if (currentDisplay.length > charLimit) { errorLight(); return false; 
    } else if (currentDisplay.length === charLimit && type === 'add') { errorLight(); return false;} 

    if (currentDisplay.length === 0) { calculatorScreen.innerHTML = '0'; }
    if (type === 'add') { calculatorScreen.innerHTML = currentDisplay + input; console.log('HDD'); }
    if (type === 'new') { calculatorScreen.innerHTML = input; }


    // Limit number digits to set limit
    if (type === 'solution') {

        let overflowInput = input;

        // Show any numbers too large for screen as exponents
        if (overflowInput.toString().length > charLimit) { 
            if (overflowInput > 10000000000000 || overflowInput < -10000000000000) {
                overflowInput = Math.round(Number(((overflowInput / (10 ** (overflowInput.toString().length - 1))).toString().slice(0,10) * (1000000000000)) / (1000000000000))) + 'ᴇ' + overflowInput.toString().length;
            } else {
            // Otherwise, round large numbers (full or decimal) to global limit 
            overflowInput = Math.round(Number(overflowInput.toString().slice(0, charLimit)) * (10 ** charLimit)) / 10 ** charLimit; }
        }

        calculatorScreen.innerHTML = overflowInput; // Display outputted number on screen
        firstNumberInput = input; // Keep full, uncondensed number for future calculations
    }
}

// Add a check to see if the user has checkEquationd a problem
// Add button check constants
let alreadyEquated = false;
let operatorInUse = false;
let decimalInUse = false;
let clearNextInput = false;



// Clear calculator 'screen' and reset booleans
function clearScreen() {
    calculateIsOn = true;
    operatorInUse = false;
    decimalInUse = false;
    alreadyEquated = false;
    firstNumberInput = '';
    secondNumberInput = '';
    operatorInput = '';
    calculatorScreen.innerHTML = '0';
}


// Object map with operators assigned to their functions
// Use ex. -> operatorLookup['+'](5, 2) =>>> 5 + 2
const operatorLookup = {
    '+': (a, b) => ((a * 100) + (b * 100)) / 100,
    '−': (a, b) => ((a * 100) - (b * 100)) / 100,
    '×': (a, b) => (a * b),
    '÷': (a, b) => (a / b)
}

// List of valid input numbers to be used
const validNumbers = ['0','1','2','3','4','5','6','7','8','9'];

// Unique buttons
const backButtonValue = document.querySelector('#back-button').value;
const decimalButtonValue = document.querySelector('#decimal-button').value;
const equalsButton = document.querySelector('#equals-button').value;
const clearButton = document.querySelector('#clear-button').value;

// Value of buttons evaluated for type / function (should be inputted as string value)
function buttonEvaluator(buttonValue=String) {

    // Turns calculator on or off (off if value is 'off')
    powerSwitch(buttonValue);

    // Current screen html value
    let screenInput = calculatorScreen.innerHTML;

    // Clear button is used
    if (buttonValue === clearButton) { clearScreen(); return; }

    // Check if clear boolean on, clear out screen for next series of inputs
    if (clearNextInput) { clearNextInput = false; screenInput = ''; screenDisplay('', 'new');}

    // For valid number inputs
    if (buttonValue in validNumbers) { if (screenInput === '0') { screenDisplay(buttonValue, 'new') } else { screenDisplay(buttonValue, 'add')} return; }

    // Equal sign used, send inputted equation to be checked
    if (buttonValue === equalsButton) { secondNumberInput = screenInput; operate(operatorInput, firstNumberInput, secondNumberInput); return; }

    // Decimal button is used
    if (buttonValue === decimalButtonValue) {
        if (!decimalInUse) { decimalInUse = true; 
            if (screenInput === '0' || alreadyEquated) { screenDisplay(buttonValue, 'new');} else { screenDisplay(buttonValue, 'add')}}
        return; 
    }

    // Backspace is used, end of string is sliced off
    if (buttonValue === backButtonValue) {
        console.log(alreadyEquated)
        if (alreadyEquated) { clearScreen(); return; }
        if (screenInput.at(-1) === decimalButtonValue) { decimalInUse = false; } // Toggle use of decimal back on if deleted
        let newScreenInput = screenInput.slice(0, -1);
        screenDisplay(newScreenInput, 'new');
        return;
    }

    // An operator is used, determine what functions to run
    if (buttonValue in operatorLookup) {
        if (screenInput === '0' && buttonValue === '−' || screenInput === '' && buttonValue === '−') {screenDisplay('-', 'new'); return;} // Display negative sign if first entry on new screen
        if (firstNumberInput === '') { firstNumberInput = screenInput; operatorInput = buttonValue, operatorInUse = true; clearNextInput = true; decimalInUse = false; return; } // Store current number and operator, toggle operator boolean
        if (!operatorInUse) { operatorInUse = true; operatorInput = buttonValue; clearNextInput = true; return; } // After using operator first time, ready for next number input
        if (operatorInUse && !alreadyEquated && secondNumberInput === '') { secondNumberInput = screenInput; operate(operatorInput, firstNumberInput, secondNumberInput); return; } // Run equation if operator already present
    }
}


// Calc variables
let firstNumberInput = '';
let secondNumberInput = '';
let operatorInput = '';


// Runs equation based on matching operators
// Updates 'screen' with solution
function operate(operator, firstNumber, secondNumber) {
    // Check for incorrect inputs, send error light if found
    if (!operator in operatorLookup || isNaN(firstNumber) || isNaN(secondNumber) || firstNumber === '' || secondNumber === '' || operator === '') { errorLight(); return false; } 

    let solution = operatorLookup[operator](firstNumber, secondNumber);

    // Handle different type of 'errors' that may occur
    if (solution === Infinity) { errorLight(`ERR00000R`, 2200, 'div0'); return false; } 
    else if (solution === NaN) { errorLight(); return false; }



    // Express large numbers over 14 digit limit (whole integers)
    
    console.log(solution)
    // Update 'screen' and reset boolean values
    alreadyEquated = true;
    decimalInUse = false;
    operatorInUse = false
    firstNumberInput = solution;
    secondNumberInput = '';
    operatorInput = '';
    screenDisplay(solution, 'solution');
}


// Send values of inputted buttons (clicked on screen) to button check
const calculatorButtons = document.querySelectorAll('.input-button');
calculatorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        buttonEvaluator(button.value);
    })
});


// Supported non-number (unique) keyboard inputs to match calculator buttons
const keyboardOperatorLookup = {
    '+': ' + ',
    '-': ' − ',
    '*': ' × ',
    '/': ' ÷ ',
    'Enter': '=',
    '.': '.'
}

const keyboardButton = document.addEventListener('keydown', (event) => {
    event.preventDefault();
    console.log(event.key)
    if (event.key in keyboardOperatorLookup) {
        buttonEvaluator(keyboardOperatorLookup[event.key])
    } else {
        buttonEvaluator(event.key);
    }
});


// Turn calculator 'on' or 'off'
const powerLight = document.querySelector('#power-light');
function powerSwitch(status) {
    if (status === 'off') {
        calculatorScreen.innerHTML = '';
        powerLight.style.display = 'none';
        throw Error("CALCULATOR_OFF"); // Force ends all functions
    } else { powerLight.style.display = 'block';}
}


// Error message element and function
const errorLightEl = document.querySelector('#error-light');
const calcTitleText = document.querySelector('#calculator-title');
const calcTitleTextOriginal = calcTitleText.innerHTML;
function errorLight(message, duration=100, type='') {
    // Show optional error message for specified time, then clear element
    errorLightEl.style.display = 'block';
    // Show error message (limit to 7 digits)
    if (message) { calculatorScreen.innerHTML = message;}
    if (type === 'div0') {calcTitleText.innerHTML = 'You cannot divide by 0!';}
    
    setTimeout(() => {
        errorLightEl.style.display = 'none';
        if (message) { clearScreen(); }
        if (type === 'div0') { calcTitleText.innerHTML = calcTitleTextOriginal; }
    }, duration); 
}
