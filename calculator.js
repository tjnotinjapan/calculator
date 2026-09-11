// Object map with operators assigned to their functions
// Use ex. -> operatorLookup['+'](5, 2) =>>> 5 + 2
const operatorLookup = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    }


// Prevent more than one operator being used at a time
let operatorCounter = 0;
function buttonCheck(buttonValue) {
    if (buttonValue.trim() in operatorLookup) {
        if (operatorCounter === 0) {
            operatorCounter += 1;
        } else {
            return false;
        }
    }
    return true;
}

// Set 'screen' variable and clear it out on first load
const calculatorInputScreen = document.querySelector('#calculator-screen');
function clearScreen() {
    calculatorInputScreen.innerHTML = '';
    operatorCounter = 0;
}
clearScreen();

// Allow users to clear out input 'screen'
const clearInputButton = document.querySelector('#clear-button');
clearInputButton.addEventListener('click', (event) => {
    event.preventDefault();
    clearScreen();
})


// Add a check to see if the user has computed a problem
// If true, then calculator 'screen' should clear before next inputs
let alreadyEquated = false;

// Update the calculator 'screen' with inputs from user (numbers and operators) >>> limit to one operator currently
const calculatorButtons = document.querySelectorAll('.input-button');
calculatorButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        // Check if the user has already equated a problem
        console.log('equated? ' + alreadyEquated);

        if (alreadyEquated && !buttonCheck(button.value)) {
            alreadyEquated = false; // User can use current value with operator
        } else if (alreadyEquated) {
            clearScreen(); // Clear screen for new first number input
            alreadyEquated = false;
        } else if (!buttonCheck(button.value)) {
            console.log('FAILED BUTTON CHECK')
            return; // Limit user to one operator at a time
        }
        calculatorInputScreen.innerHTML = calculatorInputScreen.innerHTML + button.value;
    })
});





// Return result of math based on operators and inputs to calculator screen
function operate(operator, firstNumber, secondNumber) {
    console.log(operatorLookup[operator](firstNumber, secondNumber));
    calculatorInputScreen.innerHTML = operatorLookup[operator](firstNumber, secondNumber);
    
}

// Compute inputted string from calculator (ex '25 + 25')
function compute(input) {
    const mathVariables = input.split(" ");
    operate(mathVariables[1], parseInt(mathVariables[0]), parseInt(mathVariables[2]));
}

// Attempt to calculate input when '=' clicked
const equalsButton = document.querySelector('#equals-button');
equalsButton.addEventListener('click', (event) => {
    event.preventDefault();
    compute(calculatorInputScreen.innerHTML);
    alreadyEquated = true;
})
