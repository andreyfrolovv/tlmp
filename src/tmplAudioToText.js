/**
 * Создает DOM-элемент карточки на основе объекта реплики.
 * @param {Object} item - Объект из массива data.text
 * @returns {HTMLElement} - Готовый DOM-элемент (div.card)
 */
export default function createTranscriptCard(item) {
  const card = document.createElement('div');
  card.className = 'card mb-3 shadow-sm';

  const text = item.data.text
  const speakerName = text[0].speaker?.trim() || "";

  console.log(text[0])

  card.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="card-subtitle text-primary fw-bold m-0">${speakerName}</h6>
        <span class="badge bg-secondary-subtle text-secondary-emphasis border">
          ${text[0].start}с - ${text[0].end}с
        </span>
      </div>
      <p class="card-text text-dark-emphasis m-0">${tr(text[0].text)}</p>
    </div>
  `;

  return card;
}