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
- Added `operatorLookup` which is an object with basic 4 operators (+, -, *, /) and their math functions
- Added `compute` function to take an inputted string, split into operator and numbers to send to operate function
- Added `clearScreen` function to clear out calculator 'screen' on page load and for future clear button
- Added clear button and event listeners for operator and number buttons
- Added and did basic testing of simple functions (ex. 4 + 5), as well as being able to clear if input new numbers after or continuing with current value if an operator is inputted
### 9/13/2026
- Added a decimal button to calculator, added check to ensure only used once per number
- Added 0 in front of decimal if inputted without a number
- Changed button checks to boolean values and moved to top
- Changed `compute` function from parseInt to parseFloat to accomodate decimals
- Redid functions for compute to account for incorrect equations being entered
- Moved boolens for alreadyEquated and decimalInUse to `compute` from `equalsButton` to ensure only checked if correct equation entered
### 9/14/2026
- Fixed `compute` checking if operator or numbers were correct, ex: used isNan(firstNumber) instead of !firstNumber
- Added an error message that pops up when user inputs invalid equations or get invalid results
- Changed `compute` fucntion name to `checkEquation`
- Added ability to run inputted equation when another operator used (ex. 4 + 4 - 2 would become 4 + 4 -> 8 -2). User can input operators again and again instead of using '=' between each set of equations
- Modifide `operatorLookup` equations to handle floating point issues (for + and - equations)
- Changed how the back button is checked to allow decimal to be re-used after deletion
- Changed how the decimal button is checked to ensure '0.' shows up on screen after an equation has been run (clear screen as new entry like inputting new first number)
### 9/14/2026 part ii
- Started CSS / HTML edits for calculator GUI. Added colors, flex box, and reordered buttons
- Added OFF button that throws an error to terminate all functions when pressed. Will add on/off indicator to GUI later.
- Changed decimal from 0. to just . when entered with no leading integer.
- Changed back to update 'screen' html to '0' when all numbers / inputted elements are erased.
### 9/15/2026
- Redid javascript to cleanup (see commit notes): revamped button check function to `buttonEvaluator` that will checks all conditions to see if button is valid and what to do (use an operator, run equation, and more).
- Added keyboard support, using a lookup object to ensure keyboard key values match calculator values used on HTML buttons
### 9/15 (ii) - 9/16/2026
- Added custom divide by 0 error effect
- Added power light with visuable function
- Removed `useOperator`, `useDecimal`, and `useBackspace` functions, moved basic functions to `buttonEvaluator`.
- `screenDisplay` function handles new or added inputs. 
- Added booleans and variables to keep track of operators and first/second number inputs. 
- Removed operators showing on screen. 
### 9/16/2026 part ii
- Finished combining all button actions into `buttonEvaluator`
- Added rounding support and global limit of 14 digits
- CSS and HTML adjusted for calculator appearance
- Added some support for whole numbers too big for screen. Need to increase accuracy.
### 9/17/2026
- Branched and redid javascript section heavily. Moved from string input for `operate` to an object.
- `calculatorEquation` object has operator, firstNumber, and secondNumber in it. `buttonEvaluator` and `screenDisplay` now check and modify it to instead of using several booleans.
- JS has been streamlined as a result.
- Used toPrecision to modify numbers too large for screen. Should keep within set 14-character limit to fit on screen.
- Need to do bug testing but all core functions and extra credit implemented.
- Merged branch back to main.
### 9/17/2026 part ii
- Reduced charlimit to 13.
- Fixed decimal not working after an operator is used.
- Screen now shows '0' if backspace used to remove all digits / turn on calculator.
- Fixed being able to span an operator to keep calculating.
### Bugs to fix
- subtract operator as negative for 2nd number
- operator key being highlighted while in use
