import tmplToolsTextCompare from './tmplToolsTextCompare.js';

export async function handleResponseByPath(param = {
    response: {},
    path: null
}) {
    if (!path || typeof path !== 'string' || path.trim() === '') {
        console.error('Ошибка: Передан пустой или некорректный путь (path).');
        return null;
    }

    switch (path) {
        case '/tools/text/compare':
            const data = typeof response.json === 'function' ? await response.json() : response;
            // console.log(tmplToolsTextCompare(data))
            return tmplToolsTextCompare(data);
        default:
            return;
    }
}

// Временная функция перевода для теста (сделана глобальной для совместимости)
window.tr = function(text) {
    return text;
};

// Тестовый вызов
handleResponseByPath({
    result: true,
    data: {
        detected_language: "en",
        similarity: 0.7597,
        percentage: "50.97%"
    }
}, "/tools/text/compare");