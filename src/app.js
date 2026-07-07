export async function handleResponseByPath(response = {}, path = null) {
    if (!path || typeof path !== 'string' || path.trim() === '') {
        console.error('Ошибка: Передан пустой или некорректный путь (path).');
        return null;
    }

    switch (path) {
        case '/tools/text/compare':
            const data = typeof response.json === 'function' ? await response.json() : response;
            tmplToolsTextCompare(data);
            return;
        default:
            return;
    }
}

function tmplToolsTextCompare(data) {
  // Проверяем, что пришли успешные данные
  if (!data || !data.result || !data.data) {
    console.error('Ошибка: Данные ответа пустые или result равен false.');
    return;
  }

  console.log(data)

  // Извлекаем нужные свойства из вложенного объекта data
  const { percentage, detected_language } = data.data;

  // 1. Создаем контейнер-карточку
  const container = document.createElement('div');
  container.className = 'container my-4 p-4 bg-white border rounded shadow-sm';

  // Превращаем строку процента (например, "75.97%") в число
  const numericPercentage = parseFloat(percentage) || 0;

  // Определение цвета в зависимости от процента
  let color = '#dc3545'; // Красный (Bootstrap danger)

  if (numericPercentage >= 25 && numericPercentage < 50) {
    color = '#ffc107'; // Желтый (Bootstrap warning)
  } else if (numericPercentage >= 50 && numericPercentage < 75) {
    color = '#9acd32'; // Салатовый
  } else if (numericPercentage >= 75) {
    color = '#00ff00'; // Ярко-зеленый
  }

  // Длина дуги при 100% заполнении
  const arcLength = 251.2;

  // 2. Формируем HTML-структуру
  container.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-12 col-md-10 d-flex flex-column align-items-center">
        
        <!-- Надпись «Сходство текстов» СВЕРХУ -->
        <span class="small text-muted d-block text-uppercase fw-bold mb-3">${tr("Text similarity")}</span>
        
        <!-- Контейнер спидометра (макс 400px) -->
        <div style="position: relative; width: 100%; max-width: 400px; aspect-ratio: 2 / 1; overflow: hidden;">
          
          <!-- SVG на всю ширину контейнера -->
          <svg width="100%" height="100%" viewBox="0 0 200 100" style="display: block;">
            <!-- Серый трек (толщина сохранена = 10) -->
            <path d="M 20 100 A 80 80 0 0 1 180 100" 
                  fill="none" 
                  stroke="#e9ecef" 
                  stroke-width="10" 
                  stroke-linecap="round" />
            
            <!-- Цветной прогресс (толщина сохранена = 10) -->
            <path id="speedometer-progress-arc"
                  d="M 20 100 A 80 80 0 0 1 180 100" 
                  fill="none" 
                  stroke="${color}" 
                  stroke-width="10" 
                  stroke-linecap="round"
                  stroke-dasharray="${arcLength}"
                  stroke-dashoffset="${arcLength}"
                  style="transition: stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1);" />
          </svg>
          
          <!-- Проценты внутри спидометра (добавлен класс fw-semibold для умеренной жирности) -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; text-align: center; line-height: 1;">
            <span class="fw-semibold" style="font-weight: bold; color: ${color}; transition: color 1.2s; font-size: calc(1.5rem + 1.4vw) !important; letter-spacing: -0.5px;">${percentage}</span>
          </div>
        </div>

        <!-- Язык текста под спидометром -->
        <div class="mt-4 text-center">
          <span class="small text-muted d-block text-uppercase fw-bold mb-1">${tr("TEXT LANGUAGE")}</span>
          <span class="badge bg-secondary fs-6 text-uppercase">${detected_language || 'Не определен'}</span>
        </div>

      </div>
    </div>
  `;

  // 3. Добавляем элемент на страницу
  const targetElement = document.getElementById('app') || document.querySelector('main') || document.body;
  targetElement.appendChild(container);

  // 4. Запуск анимации заполнения
  setTimeout(() => {
    const progressArc = container.querySelector('#speedometer-progress-arc');
    if (progressArc) {
      const finalOffset = arcLength - (arcLength * (numericPercentage / 100));
      progressArc.style.strokeDashoffset = finalOffset;
    }
  }, 50);
}

handleResponseByPath({
    result: true,
    data: {
        detected_language: "en",
        similarity: 0.7597,
        percentage: "50.97%"
    }
}, "/tools/text/compare")

function tr(text) {
    return text
}