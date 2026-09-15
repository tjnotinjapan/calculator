// Set 'screen' variable
const calculatorScreen = document.querySelector('#calculator-screen');

// Adds inputs to screen to display on calculator
function screenDisplay(input, type='add') {
    const currentDisplay = calculatorScreen.innerHTML;

    // Show '0' if there is no input
    if (currentDisplay.length === 0) { calculatorScreen.innerHTML = '0'; }

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


// // Use operator if valid for calculator
// function useOperator(buttonValue, screenInput) {

//     if (buttonValue.trim() in operatorLookup) {

//         // Highlight operator button 'pressed'



//         // If no operator used yet, add to screen input and reset decimal boolean
//         if (!operatorInUse) {
//             calculatorScreen.innerHTML = screenInput + buttonValue;
//             operatorInUse = true;
//             decimalInUse = false;
//             return;
        
//         } else {
//             // Prevent multiple operators inputted together
//             if (screenInput.split('').at(-1) == ' ') {
//                 return false;
//             }
//             // If already equated, using sum as first number in new equation
//             if (alreadyEquated) {
//                 alreadyEquated = false;
//                 calculatorScreen.innerHTML = screenInput + buttonValue;
//                 return;
//             // Run the equation first before adding operator to outputted sum
//             } else if (!alreadyEquated) {
//                 checkEquation(screenInput); // Changes innerHTML of screen to sum (or exits out if equation not valid)
//                 calculatorScreen.innerHTML = calculatorScreen.innerHTML + buttonValue;
//                 operatorInUse = true;
//                 alreadyEquated = false;
//                 decimalInUse = false;
//                 return;
//             }
//         }
//     }
//     throw Error('buttonValue must be that of an operator to use this function'); // Wrong button value inputted into function
// }


// function useBackButton(buttonValue, screenInput) {
//     console.log(buttonValue, backButtonValue);
//     // Check if back button used
//     if (buttonValue === backButtonValue) {
//         if (screenInput === '' || alreadyEquated){
//             clearScreen();
//             return; // Do nothing, nothing to erase
//         }
//         // Split string into an array
//         // Remove (pop) last item
//         // Join back and fill 'screen' with reduced array
//         let removedLastInput = screenInput.split('');
//         let removedLastInputValue = removedLastInput.at(-1);

//         if (removedLastInput.length == '1' && removedLastInput[0] == 0){
//             return; // Don't erase '0' if it is only element in string
//         }

//         if (removedLastInputValue === ' ') { // Check for operator (ex. ' + ')
//             operatorInUse = false; // Operator is deleted, user can use a new operator
//             removedLastInput.length = removedLastInput.length - 3;
//         } else if (removedLastInputValue === '.') {
//             removedLastInput.pop(); // Pop off last element
//             decimalInUse = false; // Allow decimal to be used again
//         } else {
//             removedLastInput.pop(); // Pop off last element
//         }

//         // Join altered array and update 'screen' value
//         const newInputString = removedLastInput.join('');
//         if (newInputString.length === 0) {
//             clearScreen(); // Reset screen if all inputs were deleted
//         } else {
//             calculatorScreen.innerHTML = newInputString;
//         }

//         return; // Back button used
//     }
//     throw Error('buttonValue inputted does not match back button value'); // Button is not a back button
// }

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

    // Current screen html value
    let screenInput = calculatorScreen.innerHTML;

    // Clear button is used
    if (buttonValue === clearButton) { clearScreen(); }

    // Check if clear boolean on, clear out screen for next series of inputs
    if (clearNextInput) { clearNextInput = false; screenInput = ''; screenDisplay('', 'new'); }

    // For valid number inputs
    if (buttonValue in validNumbers) { if (screenInput === '0') { screenDisplay(buttonValue, 'new') } else { screenDisplay(buttonValue, 'add')}}

    // Equal sign used, send inputted equation to be checked
    if (buttonValue === equalsButton) { secondNumberInput = screenInput; operate(operatorInput, firstNumberInput, secondNumberInput);}

    // Decimal button is used
    if (buttonValue === decimalButtonValue) {
        if (!decimalInUse) { decimalInUse = true; 
            if (screenInput === '0' || alreadyEquated) { screenDisplay(buttonValue, 'new')} else { screenDisplay(buttonValue, 'add')}}
    }

    // Backspace is used, end of string is sliced off
    if (buttonValue === backButtonValue) {
        if (screenInput.at(-1) === decimalButtonValue) { decimalInUse = false; } // Toggle use of decimal back on if deleted
        let newScreenInput = screenInput.slice(0, -1);
        screenDisplay(newScreenInput, 'new');
    }

    // An operator is used, determine what functions to run
    if (buttonValue in operatorLookup) {

        


        if (screenInput === '0' && buttonValue === '−' || screenInput === '' && buttonValue === '−') {screenDisplay('-', 'new'); return true;} // Display negative sign if first entry on new screen
        console.log('XXX')
        if (firstNumberInput === '') { firstNumberInput = screenInput; operatorInput = buttonValue, operatorInUse = true; clearNextInput = true; decimalInUse = false; return true; } // Store current number and operator, toggle operator boolean
        if (!operatorInUse) { operatorInUse = true; operatorInput = buttonValue; clearNextInput = true; return true;}

        console.log('operator: ' + operatorInput, 'first number: ' + firstNumberInput, 'second number: ' + secondNumberInput)
        console.log(alreadyEquated, operatorInUse)
        // if (secondNumber === '') { errorLight(); console.log('xx') } // Cannot compute without a second number
        // if (alreadyEquated) { alreadyEquated = false; operator = buttonValue; firstNumber = screenInput;} // Save operator to be computed later
        if (operatorInUse && !alreadyEquated && secondNumberInput === '') { secondNumberInput = screenInput; operatorInUse = false; clearNextInput = true; operate(operatorInput, firstNumberInput, secondNumberInput);  return true; } // Run equation     
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

    const solution = operatorLookup[operator](firstNumber, secondNumber);

    // Handle different type of 'errors' that may occur
    if (solution === Infinity) { errorLight(`ERR00000R`, 2200, 'div0'); return false; } 
    else if (solution === NaN) { errorLight(); return false; }

    // Update 'screen' and reset boolean values
    screenDisplay(solution, 'new');
    alreadyEquated = true;
    decimalInUse = false;
    operatorInUse = false
    firstNumberInput = solution;
    secondNumberInput = '';
    operatorInput = '';

}


// // Check if inputted string from calculator is a valid equation
// function checkEquation(input=String) {
//     const mathVariables = input.split(" ");
//     const operator = mathVariables[1];
//     const firstNumber = parseFloat(mathVariables[0]);
//     const secondNumber = parseFloat(mathVariables[2]);
    
    
//     } else {
//         operate(operator, firstNumber, secondNumber); // Send equation through to operate if valid
//     }
// }


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
