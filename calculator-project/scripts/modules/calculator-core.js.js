// Ядро калькулятора
class CalculatorCore {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetInput = false;
        this.lastResult = null;
        this.onDisplayUpdate = null;
    }
    
    // Обновить дисплей
    updateDisplay() {
        if (this.onDisplayUpdate) {
            this.onDisplayUpdate(this.currentInput);
        }
    }
    
    // Добавить цифру или точку
    inputNumber(number) {
        if (this.shouldResetInput) {
            this.currentInput = '';
            this.shouldResetInput = false;
        }
        
        if (number === '.' && this.currentInput.includes('.')) {
            return;
        }
        
        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else {
            this.currentInput += number;
        }
        
        this.updateDisplay();
    }
    
    // Обработать операцию
    inputOperation(op, user = null) {
        if (this.currentInput === '0' && op !== 'backspace') return;
        
        if (op === 'backspace') {
            if (this.currentInput.length > 1) {
                this.currentInput = this.currentInput.slice(0, -1);
            } else {
                this.currentInput = '0';
            }
            this.updateDisplay();
            return;
        }
        
        if (this.operation !== null) {
            this.calculate();
        }
        
        this.previousInput = this.currentInput;
        this.operation = op;
        this.shouldResetInput = true;
    }
    
    // Обработка научных операций
    handleScientificOperation(op, user = null) {
        const value = parseFloat(this.currentInput);
        let result;
        
        switch (op) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'asin':
                result = Math.asin(value) * 180 / Math.PI;
                break;
            case 'acos':
                result = Math.acos(value) * 180 / Math.PI;
                break;
            case 'atan':
                result = Math.atan(value) * 180 / Math.PI;
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case 'factorial':
                result = this.factorial(value);
                break;
            case 'abs':
                result = Math.abs(value);
                break;
            case 'power':
                result = Math.pow(value, 2);
                break;
            case 'cube':
                result = Math.pow(value, 3);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            default:
                return;
        }
        
        this.currentInput = result.toString();
        this.shouldResetInput = true;
        this.lastResult = result;
        this.updateDisplay();
    }
    
    // Обработка Pro операций
    handleProOperation(op, user = null) {
        let result;
        
        switch (op) {
            case 'matrix':
                result = "Матричные операции";
                break;
            case 'determinant':
                result = "Вычисление детерминанта";
                break;
            case 'integral':
                result = "Интегральное исчисление";
                break;
            case 'derivative':
                result = "Дифференциальное исчисление";
                break;
            default:
                result = "Pro функция выполнена";
        }
        
        this.currentInput = result;
        this.shouldResetInput = true;
        this.lastResult = result;
        this.updateDisplay();
    }
    
    // Обработка Pro формул
    handleProFormula(formula, user = null) {
        let result;
        
        switch (formula) {
            case 'quadratic':
                result = "Квадратное уравнение решено";
                break;
            case 'pythagoras':
                result = "Теорема Пифагора применена";
                break;
            case 'circle-area':
                result = "Площадь круга вычислена";
                break;
            case 'sphere-volume':
                result = "Объем сферы вычислен";
                break;
            default:
                result = "Pro формула выполнена";
        }
        
        this.currentInput = result;
        this.shouldResetInput = true;
        this.lastResult = result;
        this.updateDisplay();
    }
    
    // Обработка Pro+ формул
    handleProPlusFormula(formula, user = null) {
        let result;
        
        switch (formula) {
            case 'fourier':
                result = "Преобразование Фурье";
                break;
            case 'laplace':
                result = "Преобразование Лапласа";
                break;
            case 'differential':
                result = "Дифференциальные уравнения";
                break;
            case 'quantum':
                result = "Квантовые вычисления";
                break;
            default:
                result = "Pro+ функция выполнена";
        }
        
        this.currentInput = result;
        this.shouldResetInput = true;
        this.lastResult = result;
        this.updateDisplay();
    }
    
    // Факториал
    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    // Вычислить результат
    calculate() {
        if (this.operation === null || this.shouldResetInput) return null;
        
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;
        
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    result = 'Ошибка: деление на ноль';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return null;
        }
        
        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = '';
        this.shouldResetInput = true;
        this.lastResult = result;
        
        this.updateDisplay();
        return result;
    }
    
    // Очистить всё
    clearAll() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.lastResult = null;
        this.updateDisplay();
    }
    
    // Очистить текущий ввод
    clearEntry() {
        this.currentInput = '0';
        this.updateDisplay();
    }
}

export default new CalculatorCore();