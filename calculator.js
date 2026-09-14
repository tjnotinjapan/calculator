// Set 'screen' variable
const calculatorScreen = document.querySelector('#calculator-screen');


// Add a check to see if the user has checkEquationd a problem
// Add button check constants
let alreadyEquated = false;
let operatorInUse = false;
let decimalInUse = false;

const backButtonValue = document.querySelector('#back-button').value;
const decimalButtonValue = document.querySelector('#decimal-button').value;

// Clear calculator 'screen' and reset booleans
function clearScreen() {
    calculateIsOn = true;
    operatorInUse = false;
    decimalInUse = false;
    alreadyEquated = false;
    calculatorScreen.innerHTML = '0';
}

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


// Object map with operators assigned to their functions
// Use ex. -> operatorLookup['+'](5, 2) =>>> 5 + 2
const operatorLookup = {
        '+': (a, b) => ((a * 100) + (b * 100)) / 100,
        '−': (a, b) => ((a * 100) - (b * 100)) / 100,
        '×': (a, b) => (a * b),
        '÷': (a, b) => (a / b)
    }


// Check input buttons
function buttonCheck(buttonValue) {
    console.log(calculatorScreen.innerHTML)
    // Check if button is an operator button
    if (buttonValue.trim() in operatorLookup) {

        if (!operatorInUse) {
            // Signal that operator has been used, decimal OK for next new number
            operatorInUse = true;
            decimalInUse = false;
        } else if (!alreadyEquated) {
            // If valid equation present, user can add another operator to previous solution
            checkEquation(calculatorScreen.innerHTML);
            alreadyEquated = false;
        } else {
            return false; // Prevent operator if one is already in use (counter at 1)
        }
    }

    // Check if decimal button used
    if (buttonValue === decimalButtonValue) {
        if (!decimalInUse) {
            decimalInUse = true; // Decimal can be used, change to true to prevent another decimal
        } else if (alreadyEquated) {
            return true;
        } else {
            return false; // Prevent decimal from being inputted again
        }
    }

    // Check if back button used
    if (buttonValue === backButtonValue) {
        if (calculatorScreen.innerHTML === '' || alreadyEquated){
            clearScreen();
            return false; // Do nothing, nothing to erase
        }
        // Split string into an array
        // Remove (pop) last item
        // Join back and fill 'screen' with reduced array
        let removedLastInput = calculatorScreen.innerHTML.split('');
        let removedLastInputValue = removedLastInput.at(-1);

        if (removedLastInput.length == '1' && removedLastInput[0] == 0){
            return false;
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

        return false;
    }
    return true; // For non-restricted buttons
}





// Allow users to clear out input 'screen'
const clearInputButton = document.querySelector('#clear-button');
clearInputButton.addEventListener('click', (event) => {
    event.preventDefault();
    clearScreen();
})


// Update the calculator 'screen' with inputs from user (numbers and operators) >>> limit to one operator currently
const calculatorButtons = document.querySelectorAll('.input-button');
calculatorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        // Button input toggles on calculator (unless OFF button pressed)
        powerSwitch(button.value); // Nothing happens if OFF pressed

        if (calculatorScreen.innerHTML === '') {
            calculatorScreen.innerHTML = '0';
        }

        // Verify button being pressed
        // If button is an operator and has already done previous calculation
        if (alreadyEquated && !buttonCheck(button.value) && button.value.trim() in operatorLookup) {
            alreadyEquated = false; // User can use current value with operator 

        // If inputs a new number after doing a calculation
        } else if (alreadyEquated && buttonCheck(button.value)) {
            clearScreen(); // Clear screen for new first number input
            alreadyEquated = false;
            buttonCheck(button.value); // Check button inputted

        // Inputs any invalid button, button check returns false
        } else if (!buttonCheck(button.value)) {
            return; // Prevent inputted button if fails check
        }

        // Replace 0 if it is the only number inputted (for non-decimal integers)
        const screenValue = calculatorScreen.innerHTML.split('');
        if (screenValue.length == 1 && screenValue[0] == 0) {
            console.log('A')
            console.log(button.value)
            if (button.value == '' || button.value.trim() in operatorLookup) { // No clear ('') or decimal inputs
                calculatorScreen.innerHTML = '0' + button.value;
                console.log('B')
            } else {
                calculatorScreen.innerHTML = button.value;
                console.log('C')
            }
        } else {
            calculatorScreen.innerHTML = calculatorScreen.innerHTML + button.value;
            console.log('D')
            
        }

        
    })
});



// Runs equation based on matching operators
// Updates 'screen' with solution
function operate(operator, firstNumber, secondNumber) {
    const solution = operatorLookup[operator](firstNumber, secondNumber);
    // Handle different type of 'errors' that may occur
    if (solution === Infinity) {
        errorMessage('Cannot divide by 0!'); // User attempts to divide by 0
        alreadyEquated = false; // Allows user to edit equation
        return;
    } else if (solution === NaN) {
        return;
    }
    calculatorScreen.innerHTML = operatorLookup[operator](firstNumber, secondNumber);
    
}


// Check inputted string from calculator (ex '25 + 25')
function checkEquation(input) {
    const mathVariables = input.split(" ");
    const operator = mathVariables[1];
    const firstNumber = parseFloat(mathVariables[0]);
    const secondNumber = parseFloat(mathVariables[2]);
    
    if (!operator in operatorLookup || isNaN(firstNumber) || isNaN(secondNumber)) {
        errorMessage('This is not a correct equation!') // Error message for failed equation
    } else {
        // Equation is correct, reset boolean and run through operate
        alreadyEquated = true;
        decimalInUse = false;
        operate(operator, firstNumber, secondNumber);
    }
}


// Attempt to calculate input when '=' clicked
const equalsButton = document.querySelector('#equals-button');
equalsButton.addEventListener('click', (event) => {
    event.preventDefault();
    checkEquation(calculatorScreen.innerHTML);
})


// Error message element and function
const errorMessageEl = document.querySelector('#error-message');
function errorMessage(message) {
    // Show error message for specified time, then clear element
    errorMessageEl.innerHTML = message;
    setTimeout(() => {
        errorMessageEl.innerHTML = '';
    }, 1000);
    
}
