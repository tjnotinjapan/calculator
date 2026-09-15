// Set 'screen' variable
const calculatorScreen = document.querySelector('#calculator-screen');


// Toggles calculator off or on visually for user
let calculateIsOn = false;

function powerSwitch(status) {
    if (status === 'off') {
        calculateIsOn = false;
        calculatorScreen.innerHTML = '';
        throw Error("CALCULATOR_OFF");
        console.log('The calculator is OFF')
    } else {
        calculateIsOn = true;
        console.log('The calculator is ON')
    }
}


// Add a check to see if the user has checkEquationd a problem
// Add button check constants
let alreadyEquated = false;
let operatorInUse = false;
let decimalInUse = false;



// Clear calculator 'screen' and reset booleans
function clearScreen() {
    calculateIsOn = true;
    operatorInUse = false;
    decimalInUse = false;
    alreadyEquated = false;
    calculatorScreen.innerHTML = '0';
}


// Use operator if valid for calculator
function useOperator(buttonValue, screenInput) {

    if (buttonValue.trim() in operatorLookup) {
        // If no operator used yet, add to screen input and reset decimal boolean
        if (!operatorInUse) {
            calculatorScreen.innerHTML = screenInput + buttonValue;
            operatorInUse = true;
            decimalInUse = false;
            return;
        
        } else {
            // Prevent multiple operators inputted together
            if (screenInput.split('').at(-1) == ' ') {
                return false;
            }
            // If already equated, using sum as first number in new equation
            if (alreadyEquated) {
                alreadyEquated = false;
                calculatorScreen.innerHTML = screenInput + buttonValue;
                return;
            // Run the equation first before adding operator to outputted sum
            } else if (!alreadyEquated) {
                checkEquation(screenInput); // Changes innerHTML of screen to sum (or exits out if equation not valid)
                calculatorScreen.innerHTML = calculatorScreen.innerHTML + buttonValue;
                operatorInUse = true;
                alreadyEquated = false;
                decimalInUse = false;
                return;
            }
        }
    }
    throw Error('buttonValue must be that of an operator to use this function'); // Wrong button value inputted into function
}

// Use decimal in equation if valid
function useDecimal(buttonValue, screenInput) {
    // Check if decimal button used
    if (buttonValue == decimalButtonValue) {
        if (!decimalInUse) {
            decimalInUse = true; // Decimal can be used, change to true to prevent another decimal
            calculatorScreen.innerHTML = screenInput + buttonValue;
            return;
        } else {
            return false; // Prevent decimal from being inputted again
        }
    }
    throw Error('buttonValue does not match decimal variable value'); // Button inputted is not a decimal
}

function useBackButton(buttonValue, screenInput) {
    console.log(buttonValue, backButtonValue);
    // Check if back button used
    if (buttonValue === backButtonValue) {
        if (screenInput === '' || alreadyEquated){
            clearScreen();
            return; // Do nothing, nothing to erase
        }
        // Split string into an array
        // Remove (pop) last item
        // Join back and fill 'screen' with reduced array
        let removedLastInput = screenInput.split('');
        let removedLastInputValue = removedLastInput.at(-1);

        if (removedLastInput.length == '1' && removedLastInput[0] == 0){
            return; // Don't erase '0' if it is only element in string
        }

        if (removedLastInputValue === ' ') { // Check for operator (ex. ' + ')
            operatorInUse = false; // Operator is deleted, user can use a new operator
            removedLastInput.length = removedLastInput.length - 3;
        } else if (removedLastInputValue === '.') {
            removedLastInput.pop(); // Pop off last element
            decimalInUse = false; // Allow decimal to be used again
        } else {
            removedLastInput.pop(); // Pop off last element
        }

        // Join altered array and update 'screen' value
        const newInputString = removedLastInput.join('');
        if (newInputString.length === 0) {
            clearScreen(); // Reset screen if all inputs were deleted
        } else {
            calculatorScreen.innerHTML = newInputString;
        }

        return; // Back button used
    }
    throw Error('buttonValue inputted does not match back button value'); // Button is not a back button
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

// Master list of all accepted buttons
const masterButtonList =  [];

// Value of buttons evaluated for type / function (should be inputted as string value)
function buttonEvaluator(buttonValue=String) {

    // Trim button value string to remove spaces (use for checking validity)
    const trimmedButton = buttonValue.trim();

    // Turns calculator on or off (off if value is 'off')
    powerSwitch(trimmedButton);

    // Get current screen input
    const screenInput = calculatorScreen.innerHTML;
    const screenInputArray = screenInput.split('');

    // If screen is at default '0' value
    if (screenInputArray.length == 1 && screenInputArray[0] == 0) {
        if (trimmedButton == '' || trimmedButton in operatorLookup) {
            calculatorScreen.innerHTML = '0' + buttonValue; // '0' or '0 + operator' is inputted
            return;
        } else if (trimmedButton in validNumbers) {
            calculatorScreen.innerHTML = buttonValue; // Number inputted replaces '0'
            return;
        } else if (trimmedButton === decimalButtonValue) {
            calculatorScreen.innerHTML = buttonValue; // '.' replaces '0'
            decimalInUse = true;
            return;
        }
    }

    // Number inputted
    if (trimmedButton in validNumbers) {
        calculatorScreen.innerHTML = screenInput + buttonValue;
        return;
    }

    // Equal sign used, send inputted equation to be checked (and run if passed)
    if (trimmedButton === equalsButton) {
        checkEquation(screenInput);
        return;
    }

    //
    if (trimmedButton === decimalButtonValue) {
        useDecimal(buttonValue, screenInput);
        return;
    }

    // Backspaced used
    if (trimmedButton === backButtonValue) {
        useBackButton(buttonValue, screenInput);
        return;
    }

    // An operator is used, send raw button value and screen input to useOperator
    if (trimmedButton in operatorLookup) {
        useOperator(buttonValue, screenInput);
        return;
    }

    // Clear button is used
    if (trimmedButton === clearButton) {
        clearScreen();
        return;
    }
    
}



// Runs equation based on matching operators
// Updates 'screen' with solution
function operate(operator, firstNumber, secondNumber) {
    const solution = operatorLookup[operator](firstNumber, secondNumber);
    // Handle different type of 'errors' that may occur
    if (solution === Infinity) {
        errorMessage('Hey! You cannot divide by 0!'); // User attempts to divide by 0
        alreadyEquated = false; // Allows user to edit equation
        return;
    } else if (solution === NaN) {
        return;
    }

    // Update 'screen' and boolean values
    calculatorScreen.innerHTML = operatorLookup[operator](firstNumber, secondNumber);
    alreadyEquated = true; // Equation is success
    decimalInUse = false; // Free to use decimal again
}


// Check if inputted string from calculator is a valid equation
function checkEquation(input=String) {
    const mathVariables = input.split(" ");
    const operator = mathVariables[1];
    const firstNumber = parseFloat(mathVariables[0]);
    const secondNumber = parseFloat(mathVariables[2]);
    
    if (!operator in operatorLookup || isNaN(firstNumber) || isNaN(secondNumber)) {
        errorMessage('This is not a correct equation!') // Error message for failed equation
    } else {
        operate(operator, firstNumber, secondNumber); // Send equation through to operate if valid
    }
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


// Error message element and function
const errorMessageEl = document.querySelector('#error-message');
function errorMessage(message) {
    // Show error message for specified time, then clear element
    errorMessageEl.innerHTML = message;
    setTimeout(() => {
        errorMessageEl.innerHTML = '';
    }, 1000);
    
}
