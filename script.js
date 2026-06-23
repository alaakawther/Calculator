let currentInput      = '';    
let previousInput     = '';    
let operator          = null;  
let shouldResetDisplay = false; 

const display = document.getElementById('display');


function updateDisplay(value) {
  if (value.toString().length > 12) {
    display.textContent = parseFloat(value).toExponential(4);
  } else {
    display.textContent = value || '0';
  }
}

function handleNumber(value) {

  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  }

  if (value === '.' && currentInput.includes('.')) return;

  if (value === '0' && currentInput === '0') return;

  currentInput += value; 
  updateDisplay(currentInput);
}


function handleOperator(value) {
 
  if (previousInput !== '' && currentInput !== '') {
    calculate();
  }

  operator      = value;
  previousInput = currentInput;
  currentInput  = '';
  shouldResetDisplay = false;
}


function calculate() {

  if (previousInput === '' || currentInput === '' || operator === null) return;

  const prev = parseFloat(previousInput); 
  const curr = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
    
      if (curr === 0) {
        updateDisplay('Error');
        clearAll();
        return;
      }
      result = prev / curr;
      break;
    default: return;
  }

  result = parseFloat(result.toFixed(10));

  updateDisplay(result);
  currentInput  = result.toString();
  previousInput = '';
  operator      = null;
  shouldResetDisplay = true;
}


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

document.querySelector('.buttons').addEventListener('click', function(event) {
 
  const button = event.target.closest('.btn');
  if (!button) return;

  const action = button.dataset.action;
  const value  = button.dataset.value;  

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

document.addEventListener('keydown', function(event) {
  const key = event.key;

  if ('0123456789.'.includes(key))       handleNumber(key);
  else if (['+', '-', '*', '/'].includes(key)) handleOperator(key);
  else if (key === 'Enter' || key === '=') calculate();
  else if (key === 'Escape')               clearAll();
  else if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1); 
    updateDisplay(currentInput || '0');
  }
});