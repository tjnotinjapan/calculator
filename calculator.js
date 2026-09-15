// Set 'screen' variable
const calculatorScreen = document.querySelector('#calculator-screen');

// Adds inputs to screen to display on calculator
function screenDisplay(input, type='add') {
    const currentDisplay = calculatorScreen.innerHTML;

    // Limit of 10 chars for screen
    if (currentDisplay.length < 11) {
        // Screen types
        // add -> just add input to screen
        // new -> override screen with new input
        if (type === 'new') { calculatorScreen.innerHTML = input;}

        if (type === 'add') { calculatorScreen.innerHTML = currentDisplay + input;}
    
    } else { errorLight(); }
    

}

// Turn calculator 'on' or 'off'
const powerLight = document.querySelector('#power-light');
function powerSwitch(status) {
    if (status === 'off') {
        calculatorScreen.innerHTML = '';
        powerLight.style.display = 'none';
        throw Error("CALCULATOR_OFF"); // Force ends all functions
    } else { powerLight.style.display = 'block';}
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

        // Highlight operator button 'pressed'



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

    // Turns calculator on or off (off if value is 'off')
    powerSwitch(buttonValue);

    // Trim button value string to remove spaces (use for checking validity)
    const trimmedButton = buttonValue.trim();

    // Current screen html value
    const screenInput = calculatorScreen.innerHTML;

    // For valid number inputs
    if (trimmedButton in validNumbers) {
        if (screenInput === '0') { screenDisplay(buttonValue, 'new')} else { screenDisplay(buttonValue, 'add')}
    }

    // Equal sign used, send inputted equation to be checked
    if (trimmedButton === equalsButton) { checkEquation(screenInput);}

    // Decimal button is used
    if (trimmedButton === decimalButtonValue) {
        if (!decimalInUse) { decimalInUse = true; 
            if (screenInput === '0' || alreadyEquated) { screenDisplay(buttonValue, 'new')
        
            } else { screenDisplay(buttonValue, 'add')}}
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
        errorLight(`Uh oh! Can't do that!`, 2200); // User attempts to divide by 0
        alreadyEquated = false; // Allows user to edit equation
        return;
    } else if (solution === NaN) {
        return;
    }

    // Update 'screen' and boolean values
    calculatorScreen.innerHTML = (operatorLookup[operator](firstNumber, secondNumber));
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
        errorLight() // Error message for failed equation
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
const errorLightEl = document.querySelector('#error-light');
function errorLight(message, duration=100) {
    // Show optional error message for specified time, then clear element
    errorLightEl.style.display = 'block';

    if (message) { // Show error message on screen
        calculatorScreen.innerHTML = message;
    }
    
    setTimeout(() => {
        errorLightEl.style.display = 'none';
        if (message) { clearScreen(); }
    }, duration);

    
}
