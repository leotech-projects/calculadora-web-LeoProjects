// ==================== CALCULATOR STATE ==================== 

const state = {
    currentInput: '0',
    previousInput: '',
    operation: null,
    memory: 0,
    history: [],
    isScientific: false,
    isDarkMode: true,
    angleMode: 'DEG', // DEG or RAD
    lastResult: 0
};

// ==================== DOM ELEMENTS ==================== 

const elements = {
    resultDisplay: document.getElementById('resultDisplay'),
    expressionDisplay: document.getElementById('expressionDisplay'),
    modeName: document.getElementById('modeName'),
    modeToggle: document.getElementById('modeToggle'),
    themeToggle: document.getElementById('themeToggle'),
    loadingScreen: document.getElementById('loadingScreen'),
    copyBtn: document.getElementById('copyBtn'),
    historyList: document.getElementById('historyList'),
    clearHistory: document.getElementById('clearHistory'),
    clock: document.getElementById('clock'),
    scientificInfo: document.getElementById('scientificInfo'),
    memoryBadge: document.getElementById('memoryBadge'),
    angleToggle: document.getElementById('angleToggle'),
    notationValue: document.getElementById('notationValue'),
    angleValue: document.getElementById('angleValue'),
    scientificGroups: [
        document.getElementById('memoryGroup'),
        document.getElementById('angleGroup'),
        document.getElementById('scientificGroup1'),
        document.getElementById('scientificGroup2'),
        document.getElementById('scientificGroup3'),
        document.getElementById('scientificGroup4'),
        document.getElementById('scientificGroup5'),
        document.getElementById('scientificGroup6')
    ]
};

// ==================== INITIALIZATION ==================== 

document.addEventListener('DOMContentLoaded', () => {
    // Initialize
    loadState();
    updateDisplay();
    setupEventListeners();
    simulateLoadingScreen();
    updateClock();
    
    // Update clock every second
    setInterval(updateClock, 1000);
});

// ==================== LOADING SCREEN ==================== 

function simulateLoadingScreen() {
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
    }, 1500);
}

// ==================== EVENT LISTENERS ==================== 

function setupEventListeners() {
    // Number buttons
    document.querySelectorAll('[data-number]').forEach(btn => {
        btn.addEventListener('click', (e) => inputNumber(e.target.dataset.number));
    });

    // Operator buttons
    document.querySelectorAll('[data-operator]').forEach(btn => {
        btn.addEventListener('click', (e) => setOperation(e.target.dataset.operator));
    });

    // Action buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            handleAction(action);
        });
    });

    // Mode toggle
    elements.modeToggle.addEventListener('click', toggleScientificMode);

    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Copy button
    elements.copyBtn.addEventListener('click', copyResult);

    // Clear history
    elements.clearHistory.addEventListener('click', clearHistoryAll);

    // Keyboard support
    document.addEventListener('keydown', handleKeyboard);
}

// ==================== NUMBER INPUT ==================== 

function inputNumber(num) {
    // Prevent multiple decimal points
    if (num === '.' && state.currentInput.includes('.')) {
        return;
    }

    // Replace initial 0
    if (state.currentInput === '0' && num !== '.') {
        state.currentInput = num;
    } else {
        state.currentInput += num;
    }

    updateDisplay();
}

// ==================== OPERATIONS ==================== 

function setOperation(op) {
    if (state.currentInput === '') return;

    if (state.previousInput !== '') {
        calculate();
    }

    state.operation = op;
    state.previousInput = state.currentInput;
    state.currentInput = '';
    updateDisplay();
}

function calculate() {
    if (!state.previousInput || !state.currentInput || !state.operation) {
        return;
    }

    let result;
    const prev = parseFloat(state.previousInput);
    const current = parseFloat(state.currentInput);

    switch (state.operation) {
        case '+':
            result = prev + current;
            break;
        case '−':
            result = prev - current;
            break;
        case '×':
            result = prev * current;
            break;
        case '÷':
            result = current === 0 ? 0 : prev / current;
            break;
        default:
            return;
    }

    // Add to history
    addToHistory(`${state.previousInput} ${state.operation} ${state.currentInput}`, result);

    state.currentInput = formatResult(result);
    state.previousInput = '';
    state.operation = null;
    state.lastResult = result;
}

// ==================== ACTION HANDLERS ==================== 

function handleAction(action) {
    switch (action) {
        case 'clear':
            clearCalculator();
            break;
        case 'delete':
            deleteLastDigit();
            break;
        case 'equals':
            if (state.operation) {
                calculate();
            }
            break;
        case 'percent':
            handlePercent();
            break;
        case 'toggleSign':
            toggleSign();
            break;
        case 'sqrt':
            applySqrt();
            break;
        case 'cbrt':
            applyCbrt();
            break;
        case 'square':
            applySquare();
            break;
        case 'cube':
            applyCube();
            break;
        case 'power':
            setOperation('^');
            break;
        case 'factorial':
            applyFactorial();
            break;
        case 'abs':
            applyAbs();
            break;
        case 'sin':
            applySin();
            break;
        case 'cos':
            applyCos();
            break;
        case 'tan':
            applyTan();
            break;
        case 'asin':
            applyAsin();
            break;
        case 'acos':
            applyAcos();
            break;
        case 'atan':
            applyAtan();
            break;
        case 'log':
            applyLog();
            break;
        case 'ln':
            applyLn();
            break;
        case 'exp':
            applyExp();
            break;
        case 'pi':
            inputNumber(Math.PI.toString());
            break;
        case 'e':
            inputNumber(Math.E.toString());
            break;
        case 'openParen':
            state.currentInput += '(';
            updateDisplay();
            break;
        case 'closeParen':
            state.currentInput += ')';
            updateDisplay();
            break;
        case 'mc':
            state.memory = 0;
            updateMemoryBadge();
            break;
        case 'mr':
            state.currentInput = state.memory.toString();
            updateDisplay();
            break;
        case 'mplus':
            state.memory += parseFloat(state.currentInput) || 0;
            updateMemoryBadge();
            break;
        case 'mminus':
            state.memory -= parseFloat(state.currentInput) || 0;
            updateMemoryBadge();
            break;
        case 'toggleAngle':
            toggleAngleMode();
            break;
    }
}

// ==================== SCIENTIFIC FUNCTIONS ==================== 

function toggleAngleMode() {
    state.angleMode = state.angleMode === 'DEG' ? 'RAD' : 'DEG';
    elements.angleToggle.textContent = state.angleMode;
    elements.angleValue.textContent = state.angleMode === 'DEG' ? 'Graus' : 'Radianos';
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

function applySqrt() {
    const current = parseFloat(state.currentInput);
    const result = Math.sqrt(current);
    addToHistory(`√${current}`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyCbrt() {
    const current = parseFloat(state.currentInput);
    const result = Math.cbrt(current);
    addToHistory(`∛${current}`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applySquare() {
    const current = parseFloat(state.currentInput);
    const result = current * current;
    addToHistory(`${current}²`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyCube() {
    const current = parseFloat(state.currentInput);
    const result = current * current * current;
    addToHistory(`${current}³`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyFactorial() {
    const current = Math.floor(parseFloat(state.currentInput));
    if (current < 0) {
        alert('Fatorial não definido para números negativos');
        return;
    }
    let result = 1;
    for (let i = 2; i <= current; i++) {
        result *= i;
    }
    addToHistory(`${current}!`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyAbs() {
    const current = parseFloat(state.currentInput);
    const result = Math.abs(current);
    addToHistory(`|${current}|`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applySin() {
    const current = parseFloat(state.currentInput);
    const angleRad = state.angleMode === 'DEG' ? toRadians(current) : current;
    const result = Math.sin(angleRad);
    addToHistory(`sin(${current}°)`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyCos() {
    const current = parseFloat(state.currentInput);
    const angleRad = state.angleMode === 'DEG' ? toRadians(current) : current;
    const result = Math.cos(angleRad);
    addToHistory(`cos(${current}°)`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyTan() {
    const current = parseFloat(state.currentInput);
    const angleRad = state.angleMode === 'DEG' ? toRadians(current) : current;
    const result = Math.tan(angleRad);
    addToHistory(`tan(${current}°)`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyAsin() {
    const current = parseFloat(state.currentInput);
    if (current < -1 || current > 1) {
        alert('Arcsen válido apenas para valores entre -1 e 1');
        return;
    }
    const resultRad = Math.asin(current);
    const result = state.angleMode === 'DEG' ? toDegrees(resultRad) : resultRad;
    addToHistory(`sen⁻¹(${current})`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyAcos() {
    const current = parseFloat(state.currentInput);
    if (current < -1 || current > 1) {
        alert('Arccos válido apenas para valores entre -1 e 1');
        return;
    }
    const resultRad = Math.acos(current);
    const result = state.angleMode === 'DEG' ? toDegrees(resultRad) : resultRad;
    addToHistory(`cos⁻¹(${current})`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyAtan() {
    const current = parseFloat(state.currentInput);
    const resultRad = Math.atan(current);
    const result = state.angleMode === 'DEG' ? toDegrees(resultRad) : resultRad;
    addToHistory(`tan⁻¹(${current})`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyLog() {
    const current = parseFloat(state.currentInput);
    if (current <= 0) {
        alert('Logaritmo não definido para números ≤ 0');
        return;
    }
    const result = Math.log10(current);
    addToHistory(`log(${current})`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyLn() {
    const current = parseFloat(state.currentInput);
    if (current <= 0) {
        alert('Logaritmo natural não definido para números ≤ 0');
        return;
    }
    const result = Math.log(current);
    addToHistory(`ln(${current})`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

function applyExp() {
    const current = parseFloat(state.currentInput);
    const result = Math.exp(current);
    addToHistory(`e^(${current})`, result);
    state.currentInput = formatResult(result);
    state.lastResult = result;
    updateDisplay();
}

// ==================== UTILITY FUNCTIONS ==================== 

function handlePercent() {
    const current = parseFloat(state.currentInput);
    const result = current / 100;
    state.currentInput = formatResult(result);
    updateDisplay();
}

function toggleSign() {
    const current = parseFloat(state.currentInput);
    state.currentInput = formatResult(-current);
    updateDisplay();
}

function deleteLastDigit() {
    if (state.currentInput === '0') return;
    state.currentInput = state.currentInput.slice(0, -1) || '0';
    updateDisplay();
}

function clearCalculator() {
    state.currentInput = '0';
    state.previousInput = '';
    state.operation = null;
    updateDisplay();
}

function formatResult(num) {
    // Handle very large or very small numbers
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-10 && num !== 0)) {
        return num.toExponential(6);
    }
    
    // Round to avoid floating point errors
    const rounded = Math.round(num * 1000000) / 1000000;
    return rounded.toString();
}

// ==================== DISPLAY UPDATE ==================== 

function updateDisplay() {
    elements.resultDisplay.textContent = state.currentInput;
    
    // Update expression display
    if (state.operation) {
        elements.expressionDisplay.textContent = `${state.previousInput} ${state.operation}`;
    } else {
        elements.expressionDisplay.textContent = '';
    }
}

// ==================== HISTORY ==================== 

function addToHistory(calculation, result) {
    const historyItem = {
        calculation,
        result: formatResult(result),
        timestamp: new Date()
    };
    
    state.history.unshift(historyItem);
    
    // Keep only last 50 items
    if (state.history.length > 50) {
        state.history.pop();
    }
    
    updateHistoryDisplay();
    saveState();
}

function updateHistoryDisplay() {
    if (state.history.length === 0) {
        elements.historyList.innerHTML = '<p class="history-empty">Nenhum cálculo ainda</p>';
        return;
    }

    elements.historyList.innerHTML = state.history.map((item, index) => `
        <div class="history-item" onclick="restoreFromHistory(${index})">
            <span class="history-calculation">${item.calculation}</span>
            <span class="history-result">${item.result}</span>
        </div>
    `).join('');
}

function restoreFromHistory(index) {
    const item = state.history[index];
    state.currentInput = item.result;
    updateDisplay();
}

function clearHistoryAll() {
    state.history = [];
    updateHistoryDisplay();
    saveState();
}

// ==================== THEME MANAGEMENT ==================== 

function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    document.body.classList.toggle('light-mode');
    
    // Update theme icon
    const icon = state.isDarkMode ? '🌙' : '☀️';
    document.querySelector('.theme-icon').textContent = icon;
    
    saveState();
}

// ==================== MODE TOGGLE ==================== 

function toggleScientificMode() {
    state.isScientific = !state.isScientific;
    
    // Update UI
    elements.scientificGroups.forEach(group => {
        if (group) {
            group.classList.toggle('active');
        }
    });
    
    elements.scientificInfo.classList.toggle('active');
    
    // Update mode name
    elements.modeName.textContent = state.isScientific ? 'Científico' : 'Simples';
    elements.modeToggle.textContent = state.isScientific ? '⚙ Simples' : '⚙ Científico';
    
    saveState();
}

// ==================== COPY RESULT ==================== 

function copyResult() {
    const text = state.currentInput;
    navigator.clipboard.writeText(text).then(() => {
        // Show feedback
        const originalText = elements.copyBtn.querySelector('span').textContent;
        elements.copyBtn.querySelector('span').textContent = '✓';
        setTimeout(() => {
            elements.copyBtn.querySelector('span').textContent = originalText;
        }, 1500);
    });
}

// ==================== MEMORY BADGE ==================== 

function updateMemoryBadge() {
    if (state.memory !== 0) {
        elements.memoryBadge.classList.add('active');
    } else {
        elements.memoryBadge.classList.remove('active');
    }
    saveState();
}

// ==================== DIGITAL CLOCK ==================== 

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    elements.clock.textContent = `${hours}:${minutes}:${seconds}`;
}

// ==================== KEYBOARD SUPPORT ==================== 

function handleKeyboard(e) {
    // Numbers
    if (e.key >= '0' && e.key <= '9') {
        inputNumber(e.key);
        return;
    }

    // Decimal
    if (e.key === '.') {
        inputNumber('.');
        return;
    }

    // Operations
    switch (e.key) {
        case '+':
            setOperation('+');
            break;
        case '-':
            setOperation('−');
            break;
        case '*':
            setOperation('×');
            break;
        case '/':
            e.preventDefault();
            setOperation('÷');
            break;
        case 'Enter':
        case '=':
            e.preventDefault();
            if (state.operation) {
                calculate();
            }
            break;
        case 'Backspace':
            deleteLastDigit();
            break;
        case 'Escape':
            clearCalculator();
            break;
        case 'c':
        case 'C':
            clearCalculator();
            break;
        case '%':
            handlePercent();
            break;
        default:
            break;
    }
}

// ==================== LOCAL STORAGE ==================== 

function saveState() {
    const dataToSave = {
        memory: state.memory,
        history: state.history,
        isDarkMode: state.isDarkMode,
        isScientific: state.isScientific,
        angleMode: state.angleMode
    };
    localStorage.setItem('calculatorState', JSON.stringify(dataToSave));
}

function loadState() {
    const saved = localStorage.getItem('calculatorState');
    if (saved) {
        const data = JSON.parse(saved);
        state.memory = data.memory || 0;
        state.history = data.history || [];
        state.isDarkMode = data.isDarkMode !== false;
        state.isScientific = data.isScientific || false;
        state.angleMode = data.angleMode || 'DEG';
        
        // Apply theme
        if (!state.isDarkMode) {
            document.body.classList.add('light-mode');
            document.querySelector('.theme-icon').textContent = '☀️';
        }
        
        // Apply scientific mode
        if (state.isScientific) {
            elements.scientificGroups.forEach(group => {
                if (group) {
                    group.classList.add('active');
                }
            });
            elements.scientificInfo.classList.add('active');
            elements.modeName.textContent = 'Científico';
            elements.modeToggle.textContent = '⚙ Simples';
        }
        
        // Update angle display
        elements.angleToggle.textContent = state.angleMode;
        elements.angleValue.textContent = state.angleMode === 'DEG' ? 'Graus' : 'Radianos';
        
        // Update memory badge
        updateMemoryBadge();
        
        // Update history
        updateHistoryDisplay();
    }
}
