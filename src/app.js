import tmplToolsTextCompare from './tmplToolsTextCompare.js';
import renderAiAnalysis from './tmplAiDetect.js'
import tmplForSeo from './tmplForSeo.js'
import createTranscriptCard from './tmplAudioToText.js'

export async function handleResponseByPath(params = {
    response: {},
    path: null,
    requestPayload: {}
}) {
    if (!params.path || typeof params.path !== 'string' || params.path.trim() === '') {
        console.error('Ошибка: Передан пустой или некорректный путь (path).');
        return null;
    }

    switch (params.path) {
        case '/tools/text/compare': {
            const data = typeof params.response.json === 'function' ? await params.response.json() : params.response;
            return tmplToolsTextCompare(data);
        }
        case '/tools/text/ai-detect': {
            // Извлекаем объект (или парсим его, если это объект ответа)
            const data2 = typeof params.response.json === 'function' ? await params.response.json() : params.response;

            // 3. Возвращаем результат
            return renderAiAnalysis(data2, params.requestPayload.text);
        }
        case '/tools/text/':
            let container = document.querySelector('#app');
            let data3 = typeof params.response.json === 'function' ? await params.response.json() : params.response;
            //container.appendChild(tmplForSeo(data3))
            return;
        //return tmplForSeo(data3)
        case '/audio/to-text':
            let container4 = document.querySelector('#app');
            let data4 = typeof params.response.json === 'function' ? await params.response.json() : params.response;
            container4.appendChild(createTranscriptCard(data4))
            return;
        default:
            return;
    }
}

// Временная функция перевода для теста (сделана глобальной для совместимости)
window.tr = function (text) {
    return text;
};

// Тестовый вызов
handleResponseByPath({
    path: '/audio/to-text',
    response: {
        "result": true,
        "data": {
            "text": [
                {
                    "speaker": "",
                    "start": 0,
                    "end": 2,
                    "confidence": 0,
                    "text": "Привет, как дела, у меня норм."
                }
            ]
        }
    }
})