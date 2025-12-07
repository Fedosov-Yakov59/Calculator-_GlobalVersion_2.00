// Система AI DeepSeek
class DeepSeekAI {
    // Обработка запросов
    processQuery(query) {
        const lowerQuery = query.toLowerCase();
        let response = '';
        
        // Простые математические вычисления
        if (lowerQuery.includes('сколько будет') || lowerQuery.includes('вычисли')) {
            const mathMatch = query.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
            if (mathMatch) {
                const a = parseInt(mathMatch[1]);
                const b = parseInt(mathMatch[3]);
                const op = mathMatch[2];
                
                let result;
                switch(op) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': result = b !== 0 ? a / b : 'Ошибка: деление на ноль'; break;
                    default: result = 'Неизвестная операция';
                }
                
                response = `Результат: ${a} ${op} ${b} = ${result}`;
            } else {
                response = 'Пожалуйста, уточните математическое выражение. Например: "сколько будет 5 + 3"';
            }
        }
        // Квадратное уравнение
        else if (lowerQuery.includes('квадратное уравнение') || lowerQuery.includes('ax²+bx+c=0')) {
            response = 'Для решения квадратного уравнения вида ax²+bx+c=0 используйте формулу: x = (-b ± √(b²-4ac)) / 2a';
        }
        // Теорема Пифагора
        else if (lowerQuery.includes('пифагор') || lowerQuery.includes('гипотенуза')) {
            response = 'Теорема Пифагора: a² + b² = c², где c - гипотенуза прямоугольного треугольника';
        }
        // Площадь круга
        else if (lowerQuery.includes('площадь круга') || lowerQuery.includes('s=πr²')) {
            response = 'Площадь круга вычисляется по формуле: S = πr², где r - радиус круга';
        }
        // Объем сферы
        else if (lowerQuery.includes('объем сферы') || lowerQuery.includes('v=4/3πr³')) {
            response = 'Объем сферы вычисляется по формуле: V = 4/3πr³, где r - радиус сферы';
        }
        // Преобразование Фурье
        else if (lowerQuery.includes('фурье') || lowerQuery.includes('fourier')) {
            response = 'Преобразование Фурье раскладывает функцию на частотные компоненты. Для дискретного сигнала используется DFT: X[k] = Σ x[n] * e^(-i2πkn/N)';
        }
        // Преобразование Лапласа
        else if (lowerQuery.includes('лаплас') || lowerQuery.includes('laplace')) {
            response = 'Преобразование Лапласа: F(s) = ∫ f(t)e^(-st) dt, где s - комплексная переменная';
        }
        // Общий ответ
        else {
            response = 'Я могу помочь с математическими вычислениями, формулами и уравнениями. Уточните ваш запрос для более точного ответа.';
        }
        
        return response;
    }
}

export default new DeepSeekAI();