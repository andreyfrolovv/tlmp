/**
 * Создает DOM-элемент карточки на основе объекта реплики с использованием Bootstrap 5.
 * @param {Array} data - Массив объектов с конфиденциальными данными
 * @param {String} fullText - Полный текст
 * @returns {HTMLElement} - Готовый DOM-элемент (div.card)
 */
export default function tmplSensetiveDetect(data = [], fullText = '') {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('card', 'shadow-sm', 'mb-3');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    mainDiv.appendChild(cardBody);

    const groups = {};
    data.forEach(item => {
        if (!groups[item.type]) {
            groups[item.type] = [];
        }
        groups[item.type].push(item);
    });

    const groupsContainer = document.createElement('div');
    groupsContainer.classList.add('row', 'g-3', 'mb-4');

    for (const type in groups) {
        const colDiv = document.createElement('div');
        colDiv.classList.add('col-md-6');

        const groupSection = document.createElement('div');
        groupSection.classList.add('p-3', 'border', 'rounded');

        const title = document.createElement('h6');
        title.classList.add('card-subtitle', 'mb-2', 'text-muted', 'fw-bold', 'text-uppercase');
        title.textContent = type;
        groupSection.appendChild(title);

        const list = document.createElement('div');
        list.classList.add('list-group');

        groups[type].forEach(item => {
            const listItem = document.createElement('button');
            listItem.type = 'button';
            listItem.classList.add('list-group-item', 'list-group-item-action', 'py-1', 'small');
            listItem.textContent = item.text;

            listItem.dataset.start = item.start;
            listItem.dataset.end = item.end;

            list.appendChild(listItem);
        });

        groupSection.appendChild(list);
        colDiv.appendChild(groupSection);
        groupsContainer.appendChild(colDiv);
    }
    cardBody.appendChild(groupsContainer);

    const hr = document.createElement('hr');
    cardBody.appendChild(hr);

    const textTitle = document.createElement('h6');
    textTitle.classList.add('text-secondary', 'mt-3', 'mb-2');
    textTitle.textContent = 'Полный текст:';
    cardBody.appendChild(textTitle);

    // 3. Создаем блок с полным текстом
    const textContainer = document.createElement('div');
    textContainer.classList.add('p-3', 'border', 'rounded', 'lh-lg');

    // Разрезаем текст на символы для точной разметки тегами span
    const textChars = fullText.split('');
    const spans = textChars.map((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.dataset.index = index;
        return span;
    });

    spans.forEach(span => textContainer.appendChild(span));
    cardBody.appendChild(textContainer);

    // 4. Логика подсветки по клику (мультивыбор с делегированием)
    groupsContainer.addEventListener('click', (event) => {
        const target = event.target.closest('.list-group-item');
        if (!target) return;

        // Переключаем активный класс на нажатой кнопке
        target.classList.toggle('active');

        // Находим все выбранные в данный момент кнопки
        const activeButtons = groupsContainer.querySelectorAll('.list-group-item.active');

        // Полностью сбрасываем стили у всего текста перед пересчетом
        spans.forEach(span => {
            span.style.textDecoration = 'none';
            span.style.color = ''
            span.style.backgroundColor = 'transparent';
            span.classList.remove('fw-bold');
        });

        // Проходим по каждой активной кнопке и подсвечиваем её диапазоны
        activeButtons.forEach(btn => {
            const start = parseInt(btn.dataset.start, 10);
            const end = parseInt(btn.dataset.end, 10);

            for (let i = start; i < end; i++) {
                if (spans[i]) {
                    // spans[i].style.textDecoration = 'underline';
                    spans[i].style.backgroundColor = '#fff3cd'; // Цвет warning в Bootstrap
                    spans[i].style.color = 'black'
                    spans[i].classList.add('fw-bold');
                }
            }
        });
    });

    return mainDiv;
}