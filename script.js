// ============================================================
// STATE — like global variables in C, these hold the
// calculator's memory between button presses.
// ============================================================

let currentInput      = '';    // what the user is currently typing
let previousInput     = '';    // number entered before the operator
let operator          = null;  // which operator: +, -, *, /
let shouldResetDisplay = false; // flag: clear display on next digit press

// Get a reference to the display element.
// Like a pointer — this gives us a handle to update the screen.
const display = document.getElementById('display');


// ============================================================
// Update the screen
// ============================================================

function updateDisplay(value) {
  // If the number is too long, use scientific notation
  if (value.toString().length > 12) {
    display.textContent = parseFloat(value).toExponential(4);
  } else {
    display.textContent = value || '0';
  }
}


// ============================================================
// Handle number / decimal button presses
// ============================================================

function handleNumber(value) {
  // If we just pressed an operator, start fresh
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }

  // Prevent multiple decimal points: 3.1.4 is invalid
  if (value === '.' && currentInput.includes('.')) return;

  // Prevent leading double zeros: 007 is not a valid number
  if (value === '0' && currentInput === '0') return;

  currentInput += value; // append digit — like strcat() in C
  updateDisplay(currentInput);
}


// ============================================================
// Handle operator button presses  (+, -, *, /)
// ============================================================

function handleOperator(value) {
  // Chain: if there's already a pending calculation, run it first.
  // This lets you do: 2 + 3 + 4 = working step by step.
  if (previousInput !== '' && currentInput !== '') {
    calculate();
  }

  operator      = value;
  previousInput = currentInput;
  currentInput  = '';
  shouldResetDisplay = false;
}


// ============================================================
// Perform the calculation
// ============================================================

function calculate() {
  // Need two numbers and an operator to proceed
  if (previousInput === '' || currentInput === '' || operator === null) return;

  const prev = parseFloat(previousInput); // like atof() in C
  const curr = parseFloat(currentInput);
  let result;

  // switch/case — identical syntax to C
  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
      // Guard against division by zero — same as in C
      if (curr === 0) {
        updateDisplay('Error');
        clearAll();
        return;
      }
      result = prev / curr;
      break;
    default: return;
  }

  // Fix floating point imprecision.
  // 0.1 + 0.2 in binary = 0.30000000000000004
  // toFixed(10) rounds to 10 decimals, then parseFloat removes trailing zeros.
  result = parseFloat(result.toFixed(10));

  updateDisplay(result);
  currentInput  = result.toString();
  previousInput = '';
  operator      = null;
  shouldResetDisplay = true;
}


// ============================================================
// Utility functions
// ============================================================

function clearAll() {
  currentInput  = '';
  previousInput = '';
  operator      = null;
  shouldResetDisplay = false;
  updateDisplay('0');
}

function toggleSign() {
  if (currentInput === '') return;
  currentInput = (parseFloat(currentInput) * -1).toString();
  updateDisplay(currentInput);
}

function handlePercent() {
  if (currentInput === '') return;
  currentInput = (parseFloat(currentInput) / 100).toString();
  updateDisplay(currentInput);
}


// ============================================================
// MAIN EVENT LISTENER
//
// In C you'd have a while(1) loop waiting for input.
// In the browser, you register a listener — the browser
// calls your function whenever something happens.
// This is called event-driven programming.
// ============================================================

document.querySelector('.buttons').addEventListener('click', function(event) {
  // Find which button was actually clicked
  const button = event.target.closest('.btn');
  if (!button) return; // clicked empty space — ignore

  const action = button.dataset.action; // reads data-action="..."
  const value  = button.dataset.value;  // reads data-value="..."

  if (value !== undefined) {
    if ('0123456789.'.includes(value)) {
      handleNumber(value);
    } else {
      handleOperator(value);
    }
  } else if (action) {
    switch (action) {
      case 'clear':     clearAll();      break;
      case 'calculate': calculate();    break;
      case 'sign':      toggleSign();   break;
      case 'percent':   handlePercent(); break;
    }
  }
});


// ============================================================
// BONUS: Keyboard support
// Pressing 7 on your keyboard triggers the 7 button.
// ============================================================

document.addEventListener('keydown', function(event) {
  const key = event.key;

  if ('0123456789.'.includes(key))       handleNumber(key);
  else if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
  else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Escape')               clearAll();
  else if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1); // remove last char
    updateDisplay(currentInput || '0');
  }
});