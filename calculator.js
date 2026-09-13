// Set 'screen' variable
const calculatorInputScreen = document.querySelector('#calculator-screen');


// Add a check to see if the user has computed a problem
// Add button check constants
let alreadyEquated = false;
let operatorInUse = false;
let decimalInUse = false;

const backButton = document.querySelector('#back-button').value;
const decimalButton = document.querySelector('#decimal-button').value;


// Object map with operators assigned to their functions
// Use ex. -> operatorLookup['+'](5, 2) =>>> 5 + 2
const operatorLookup = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    }


// Check input buttons
function buttonCheck(buttonValue) {
    // Check if button is an operator button
    if (buttonValue.trim() in operatorLookup) {
        if (!operatorInUse) {
            operatorInUse = true; // Change boolean of operator 
            decimalInUse = false; // Allow decimal to be used after operator
        } else {
            return false; // Prevent operator if one is already in use (counter at 1)
        }
    }
    // Check if decimal button used
    if (buttonValue === decimalButton) {
        if (!decimalInUse) {
            decimalInUse = true; // Decimal can be used, change to true to prevent another decimal
            if (calculatorInputScreen.innerHTML === '' || calculatorInputScreen.innerHTML.split('').at(-1) === ' ') {
                calculatorInputScreen.innerHTML += '0'; // Add 0 if decimal inputted with no number
            }
        } else {
            return false; // Prevent decimal from being inputted again
        }
    }
    // Check if back button used
    if (buttonValue === backButton) {
        if (calculatorInputScreen.innerHTML === '' || alreadyEquated){
            clearScreen();
            return false; // Do nothing, nothing to erase
        }
        // Split string into an array
        // Remove (pop) last item
        // Join back and fill 'screen' with reduced array
        let removedLastInput = calculatorInputScreen.innerHTML.split('');
        removedLastInput.pop();
        calculatorInputScreen.innerHTML = removedLastInput.join('');
        return false;
    }
    return true; // For non-restricted buttons
}


// Clear calculator 'screen' and reset booleans
function clearScreen() {
    calculatorInputScreen.innerHTML = '';
    operatorInUse = false;
    decimalInUse = false;
    alreadyEquated = false;
}


// Clear screen on first load of page
clearScreen();


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


        // Check if the user has already equated a problem
        if (alreadyEquated && !buttonCheck(button.value) && button.value.trim() in operatorLookup) {
            alreadyEquated = false; // User can use current value with operator
        } else if (alreadyEquated && buttonCheck(button.value)) {
            clearScreen(); // Clear screen for new first number input
            alreadyEquated = false;
            buttonCheck(button.value); // Check button inputted
        } else if (!buttonCheck(button.value)) {
            return; // Prevent inputted button if fails check
        }
        calculatorInputScreen.innerHTML = calculatorInputScreen.innerHTML + button.value;
    })
});



// Return result of math based on operators and inputs to calculator screen
function operate(operator = '+', firstNumber = 0, secondNumber = 0) {
    if (!operatorLookup[operator](firstNumber, secondNumber)) {
        return false;
    }
    calculatorInputScreen.innerHTML = operatorLookup[operator](firstNumber, secondNumber);
    
}


// Compute inputted string from calculator (ex '25 + 25')
function compute(input) {
    const mathVariables = input.split(" ");
    const operator = mathVariables[1];
    const firstNumber = parseFloat(mathVariables[0]);
    const secondNumber = parseFloat(mathVariables[2]);
    
    if (!operator || !firstNumber || !secondNumber) {
        // Do Nothing!! Not a proper equation
    } else {
        alreadyEquated = true;
        decimalInUse = false;
        operate(operator, firstNumber, secondNumber);
    }
}


// Attempt to calculate input when '=' clicked
const equalsButton = document.querySelector('#equals-button');
equalsButton.addEventListener('click', (event) => {
    event.preventDefault();
    compute(calculatorInputScreen.innerHTML);
})
