/**
 * Создает DOM-элемент карточки на основе объекта реплики.
 * @param {Object} item - Объект из массива data.text
 * @returns {HTMLElement} - Готовый DOM-элемент (div.card)
 */
export default function createTranscriptCard(item, payload = null) {
    const card = document.createElement('div');
    card.className = 'card mb-3 shadow-sm';

    // Извлекаем текст и массив реплик (data) из объекта item
    const mainText = item?.data?.text  || '';
    const timelineData = item?.data || [];

    // Генерируем HTML для каждой реплики из массива
    const rowsHtml = mainText.map(row => {
        const speakerName = row.speaker ? row.speaker.trim() : '';
        const startTime = row.start || 0;
        const endTime = row.end || 0;
        const speechText = row.text || '';

        return `
            <div class="mb-3 border-bottom pb-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="card-subtitle text-primary fw-bold m-0">${speakerName}</h6>
                    <span class="badge bg-secondary-subtle text-secondary-emphasis border">
                        ${startTime} - ${endTime}
                    </span>
                </div>
                <p class="card-text text-dark-emphasis m-0">${speechText}</p>
            </div>
        `;
    }).join(''); // Объединяем массив строк в одну HTML-строку

    // Собираем итоговую карточку
    card.innerHTML = `
        <div class="card-body">
            <!-- Если нужен общий текст объекта, можно раскомментировать строку ниже -->
            <!-- <h5 class="card-title">${mainText}</h5> -->
            ${rowsHtml}
        </div>
    `;

    return card;
}