// Light/Dark Mode
const toggleElement = document.querySelector('.themes__toggle');

const toggleTheme = () => {
  toggleElement.classList.toggle('themes__toggle--isActive');
  toggleElement.setAttribute(
    'aria-pressed',
    toggleElement.classList.contains('themes__toggle--isActive'),
  );
};

const toggleThemeAccessibility = event => {
  event.key === 'Enter' && toggleTheme();
};

toggleElement.addEventListener('keydown', toggleThemeAccessibility);
toggleElement.addEventListener('click', toggleTheme);

// Logic for calculator
let storedNumber = '';
let currentNumber = '';
let operation = '';
let isAfterEquals = false;

const resultElement = document.querySelector('.calc__result');
const keyElements = document.querySelectorAll('.calc__key');
const getDisplayExpression = () => {
  if (storedNumber === 'Error') {
    return 'Error';
  }

  if (isAfterEquals) {
    return `${storedNumber}`;
  }

  let expression = '';
  if (storedNumber) {
    expression += storedNumber;
  }

  if (operation) {
    expression += `${operation}`;
  }

  if (currentNumber) {
    expression += currentNumber;
  }
  return expression.trim() || '0';
};
const updateScreen = value => {
  resultElement.innerText = getDisplayExpression();
};

const numberButtonHandler = value => {
  if (isAfterEquals) {
    storedNumber = '';
    currentNumber = '';
    operation = '';
    isAfterEquals = false;
  }

  if (storedNumber === 'Error') {
    storedNumber = '';
    currentNumber = '';
    operation = '';
  }

  if (value === '.' && currentNumber.includes('.')) {
    return;
  }

  if (currentNumber === '0' && value !== '.') {
    currentNumber = value;
  } else {
    currentNumber += value;
  }

  updateScreen();
};

const resetButtonHandler = () => {
  storedNumber = '';
  currentNumber = '';
  operation = '';
  isAfterEquals = false;
  updateScreen();
};

const deleteButtonHandler = () => {
  if (isAfterEquals) {
    resetButtonHandler();
    return;
  }
  if (!currentNumber || currentNumber === '0') return;

  if (currentNumber.length === 1) {
    currentNumber = '';
  } else {
    currentNumber = currentNumber.substring(0, currentNumber.length - 1);
  }

  updateScreen();
};

const executeOperation = () => {
  if (storedNumber === 'Error') {
    updateScreen('Error');
    return;
  }
  if (currentNumber && storedNumber && operation) {
    switch (operation) {
      case '+':
        storedNumber = parseFloat(storedNumber) + parseFloat(currentNumber);
        break;
      case '-':
        storedNumber = parseFloat(storedNumber) - parseFloat(currentNumber);
        break;
      case '*':
        storedNumber = parseFloat(storedNumber) * parseFloat(currentNumber);
        break;
      case '/':
        if (parseFloat(currentNumber) === 0) {
          storedNumber = 'Error';
        } else {
          storedNumber = parseFloat(storedNumber) / parseFloat(currentNumber);
        }
        break;
    }

    operation = '';
    currentNumber = '';
    isAfterEquals = true;
    updateScreen();
  }
};

const operationButtonHandler = operationValue => {
  if (storedNumber === 'Error') {
    updateScreen('');
    return;
  }
  if (isAfterEquals) {
    currentNumber = '';
    operation = operationValue;
    isAfterEquals = false;
    updateScreen();
    return;
  }
  if (!storedNumber && !currentNumber) return;

  if (currentNumber && !storedNumber) {
    storedNumber = currentNumber;
    currentNumber = '';
    operation = operationValue;
    updateScreen();
  }

  if (storedNumber && operation && currentNumber) {
    executeOperation();
    operation = operationValue;
    isAfterEquals = false;
    updateScreen();
  } else {
    operation = operationValue;
    updateScreen();
  }
};

keyElements.forEach(element => {
  element.addEventListener('click', () => {
    const type = element.dataset.type;
    if (type === 'number') {
      numberButtonHandler(element.dataset.value);
    } else if (type === 'operation') {
      switch (element.dataset.value) {
        case 'c':
          resetButtonHandler();
          break;
        case 'Backspace':
          deleteButtonHandler();
          break;
        case 'Enter':
          executeOperation();
          break;
        default:
          operationButtonHandler(element.dataset.value);
      }
    }
  });
});

// use Keyboard as input source
const availableNumbers = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
];
const availableOperations = ['+', '-', '*', '/'];
const availableKeys = [
  ...availableNumbers,
  ...availableOperations,
  'Enter',
  'Backspace',
  'c',
];

window.addEventListener('keydown', event => {
  keyboardWithHover(event.key);
});

const keyboardWithHover = key => {
  if (availableKeys.includes(key)) {
    const elem = document.querySelector(`[data-value="${key}"]`);

    if (elem) {
      elem.classList.add('hover');
      elem.click();

      setTimeout(() => {
        elem.classList.remove('hover');
      }, 100);
    }
  }
};
