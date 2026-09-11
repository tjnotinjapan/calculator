// Object map with operators assigned to their functions
// Use ex. -> operatorLookup['+'](5, 2) =>>> 5 + 2
const operatorLookup = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    }

// Return result of math based on operators and inputs
function operate(operator, firstNumber, secondNumber) {
    console.log(operatorLookup[operator](firstNumber, secondNumber));
    return operatorLookup[operator](firstNumber, secondNumber);
    
}

// Compute inputted string from calculator (ex '25 + 25')
function compute(input) {
    const mathVariables = input.split(" ");
    operate(mathVariables[1], parseInt(mathVariables[0]), parseInt(mathVariables[2]));
}
