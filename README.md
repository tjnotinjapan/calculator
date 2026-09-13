# The Odin Project: Foundations
## Final Project: Calculator
### Create a calculator using HTML, CSS, and JavaScript skills learned in this program.

## Project Expectations
1. Basic math functions (add, subtract, multiply, divide)
2. Calculator operation consist of a number, operator, and another number (ex. 4 + 4)
3. New function operate takes in operator and two numbers
4. Basic HTML calculator with buttons for each digit and operator (including =)
5. Create function(s) that update number variables when digit buttons are clicked. Display should also update.
6. Make the calculator work!
7. Bug check.

### Extra Credit
1. Add a . button
2. Add a "backspace" button
3. Add keyboard support

# Project Log
### 9/11/2026
- Started project
- Added simple HTML, CSS, and JS files
- Added an operatorLookup which is an object with basic 4 operators (+, -, *, /) and their math funcitions
- Added compute function to take an inputted string, split into operator and numbers to send to operate function
- Added clearScreen function to clear out calculator 'screen' on page load and for future clear button
- Added clear button and event listeners for operator and number buttons
- Added and did basic testing of simple functions (ex. 4 + 5), as well as being able to clear if input new numbers after or continuing with current value if an operator is inputted
### 9/13/2026
- Added decimal function to calculator, added check to ensure only used once per number
- Added 0 in front of decimal if inputted without a number
- Changed button checks to boolean values and moved to top
- Changed compute function from parseInt to parseFloat to accomodate decimals
- Redid functions for compute to account for incorrect equations being entered
- Moved boolens for alreadyEquated and decimalInUse to compute from equals button to ensure only checked if correct equation entered
### Future to do
- Handle floats that are irregular (.1 + .2 = 0.300000004 ex.)
- Handle erasing a decimal and be able to use again
- Handle starting with decimal after computing, should clear and show '0.' on screen
- CSS / HTML edits to make calculator look nicer