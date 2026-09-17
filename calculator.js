// Set 'screen' variable
const calculatorScreen = document.querySelector('#calculator-screen');
// Limit input to 14 chars for screen
const charLimit = 13;

// Should be assigned: operator, first number, second number to run an equation
const calculatorEquation = {
    operator: '',
    firstNumber: '',
    secondNumber: ''
}

// Used for equals sign to rerun above object
// let calculateItAgain = calculatorEquation;

function resetCalculatorEquation() {
    calculatorEquation.operator = '';
    calculatorEquation.firstNumber = '';
    calculatorEquation.secondNumber = '';
}

// Resets after first number inputted to prevent duplicates / auto calculating
// Current value used to hold values that may differ from shown on screen
let currentInputValue = '';
function clearCurrentInputValue() {
    currentInputValue = '';
}

// Clear calculator 'screen' and reset booleans
function clearScreen() {
    calculatorScreen.innerHTML = '';
    clearCurrentInputValue();
}

// Informs display if next inputs should replace current displayed input
let clearScreenOnNextInput = false;

// Adds inputs to screen to display on calculator
function screenDisplay(input, type='add') {
    // Screen types
    // add -> just add input to screen
    // new -> override screen with new input
    // solution -> new calculated solution
    // Show '0' if there is no input


    if (clearScreenOnNextInput === true) { clearScreen(); clearScreenOnNextInput = false; }

    const currentDisplay = calculatorScreen.innerHTML;
    
    // Prevent any inputs over limit
    if (currentDisplay.length > charLimit) { errorLight(); return false; 
    } else if (currentDisplay.length === charLimit && type === 'add') { errorLight(); return false;} 

    if (currentDisplay.length < 1) { calculatorScreen.innerHTML = '0'; }
    if (type === 'add') { calculatorScreen.innerHTML = currentDisplay + input; currentInputValue = calculatorScreen.innerHTML; } // Update display and current input value
    if (type === 'new') { calculatorScreen.innerHTML = input; currentInputValue = calculatorScreen.innerHTML; } // Update display and current input value

    // Limit number digits to set limit
    if (type === 'solution') {

        let overflowInput = input;

        // Show any numbers too large for screen as exponents
        if (overflowInput.toString().length > charLimit) { 
            if (overflowInput > 10000000000000 || overflowInput < -10000000000000) {
                overflowInput = input.toPrecision(charLimit - 4); // Output #.########e## (-4 of char limit to allow for e### portion)
            } else {
            // Otherwise, round large numbers (full or decimal) to global limit 
            overflowInput = Math.round(Number(overflowInput.toString().slice(0, charLimit)) * (10 ** charLimit)) / 10 ** charLimit; }
        }

        calculatorScreen.innerHTML = overflowInput; // Display outputted number on screen
        calculatorEquation.firstNumber = input; // Keep full, uncondensed number for future calculations
        currentInputValue = input;
    }
}


// Object map with operators assigned to their functions
// Use ex. -> operatorLookup['+'](5, 2) =>>> 5 + 2
const operatorLookup = {
    '+': (a, b) => ((a * 100) + (b * 100)) / 100,
    '−': (a, b) => ((a * 100) - (b * 100)) / 100,
    '×': (a, b) => (a * b),
    '÷': (a, b) => (a / b)
}

// Ensure inputted value is a number
function inputIsNumber(input) {
    return Number.isFinite(parseFloat(input));
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
    if (!inputIsNumber(screenInput)) { screenInput = currentInputValue; }

    // Clear button is used
    if (buttonValue === clearButton) { clearScreen(); resetCalculatorEquation(); calculatorScreen.innerHTML = '0'; return; }

    // For valid number inputs
    if (buttonValue in validNumbers) { if (screenInput === '0') { screenDisplay(buttonValue, 'new'); return; } else { screenDisplay(buttonValue, 'add')} return; }
    // Equal sign used, send inputted equation to be checked
    if (buttonValue === equalsButton) { 
        // if (validateEquation(calculateItAgain) && clearScreenOnNextInput === true) { operate(calculateItAgain);
        calculatorEquation.secondNumber = currentInputValue; operate(calculatorEquation); } // Equals can redo calculation again and again else do normal calculation
            

    // Decimal button is used
    if (buttonValue === decimalButtonValue) {
        if (screenInput === '0') { screenDisplay(buttonValue, 'new'); } 
        else if (clearScreenOnNextInput === true) { screenDisplay(buttonValue, 'new'); }
        else if (screenInput.split('').includes(decimalButtonValue)) {
            // Do nothing, decimal present
        } else { screenDisplay(buttonValue, 'add')}
        return;
    }

    // Backspace is used, end of string is sliced off
    if (buttonValue === backButtonValue) {
        if (screenInput.length === 1 || screenInput.length === 0 || clearScreenOnNextInput === true) { screenDisplay('0', 'new'); return; }
        let newScreenInput = screenInput.slice(0, -1);
        screenDisplay(newScreenInput, 'new');
        return;
    }

    // An operator is used, determine what functions to run
    if (buttonValue in operatorLookup) {

        if (screenInput === '0' && buttonValue === '−' || screenInput === '' && buttonValue === '−') {screenDisplay('-', 'new'); return;} // Display negative sign if first entry on new screen
        if (calculatorEquation.operator === '') { // No operator in array
            // Add input to first number array slot
            if (calculatorEquation.firstNumber === '' && inputIsNumber(screenInput)) { calculatorEquation.operator = buttonValue; calculatorEquation.firstNumber = screenInput; clearScreenOnNextInput = true; clearCurrentInputValue();}
            if (inputIsNumber(calculatorEquation.firstNumber)) { calculatorEquation.operator = buttonValue; }
        } else { // Attempt to run the equation through operate and assign new array values for operator and first number
            if (inputIsNumber(calculatorEquation.firstNumber) && inputIsNumber(screenInput) && !clearScreenOnNextInput) { calculatorEquation.secondNumber = currentInputValue; operate(calculatorEquation); calculatorEquation.operator = buttonValue; calculatorEquation.firstNumber = calculatorScreen.innerHTML; }
        }
        return;
    }
    
    errorLight(); // If button input gets through all above checks it is not a valid input
}



// Runs equation based on matching operators
// Updates 'screen' with solution
function operate(equationObj) {

    if (validateEquation(equationObj)) {

        let solution = operatorLookup[equationObj.operator](equationObj.firstNumber, equationObj.secondNumber);

        

        // Handle different type of 'errors' that may occur
        if (solution === Infinity) { errorLight(`ERR00000R`, 2200, 'div0'); return false; } 
        else if (solution === NaN) { errorLight(); return false; }

        // Express large numbers over 14 digit limit (whole integers)
        resetCalculatorEquation();
        screenDisplay(solution, 'solution');
        clearScreenOnNextInput = true;
    }
}

// Ensure a proper equation is present
function validateEquation(equationObj) {
    if (equationObj.operator in operatorLookup && inputIsNumber(equationObj.firstNumber) && inputIsNumber(equationObj.secondNumber)) {
        return true;
    } else { errorLight(); return false;}
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
        resetCalculatorEquation();
        clearCurrentInputValue();
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
        if (type === 'div0') { calcTitleText.innerHTML = calcTitleTextOriginal; powerSwitch('off'); }
    }, duration); 
}
