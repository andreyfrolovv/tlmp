export default function renderAiAnalysis(responseData, fullText = null) {
  const { data } = responseData;
  const aiPercent = Math.round(data.ai_probability * 100);
  const thresholdValue = data.applied_threshold; // Выводим как есть, без перевода в проценты
  const isAiText = data.is_ai ? `${tr('Yes')}` : `${tr('No')}`; // Данные из JSON не оборачиваем в rt()

  // Функция для определения цвета на основе порога строгости
  function getColorByThreshold(probability, threshold) {
    if (probability > threshold) {
      return {
        hex: "#dc3545", // Красный
        bgStyle: "background-color: #f8d7da; padding: 2px 0px; font-weight: 500; border-radius: 2px;"
      };
    } else if (probability >= (threshold / 2)) {
      return {
        hex: "#ffc107", // Желтый
        bgStyle: "background-color: #fff3cd; padding: 2px 0px; font-weight: 500; border-radius: 2px;"
      };
    } else {
      return {
        hex: "#198754", // Зеленый (для круга)
        bgStyle: "" // Зеленую зону никак не выделяем фоном
      };
    }
  }

  // Цвет для главного круга (на основе общей вероятности)
  const mainColor = getColorByThreshold(data.ai_probability, data.applied_threshold).hex;

  // Настройки SVG круга
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (aiPercent / 100) * circumference;

  let textHtml = "";

  if (fullText) {
    // ВАРИАНТ 1: Если передан fullText
    let textSegments = [];
    for (let i = 0; i < fullText.length; i++) {
      textSegments.push({ char: fullText[i], maxProb: -1, hasChunk: false });
    }

    data.chunks.forEach(chunk => {
      let startIndex = fullText.indexOf(chunk.text_snippet);
      while (startIndex !== -1) {
        for (let i = 0; i < chunk.text_snippet.length; i++) {
          const targetIndex = startIndex + i;
          if (targetIndex < textSegments.length) {
            textSegments[targetIndex].hasChunk = true;
            if (chunk.ai_probability > textSegments[targetIndex].maxProb) {
              textSegments[targetIndex].maxProb = chunk.ai_probability;
            }
          }
        }
        startIndex = fullText.indexOf(chunk.text_snippet, startIndex + 1);
      }
    });

    let currentMaxProb = null;
    let currentHasChunk = null;

    textSegments.forEach((seg, index) => {
      const effectiveProb = (seg.hasChunk && seg.maxProb >= (data.applied_threshold / 2)) ? seg.maxProb : -1;
      const prevEffectiveProb = (index > 0 && textSegments[index - 1].hasChunk && textSegments[index - 1].maxProb >= (data.applied_threshold / 2)) ? textSegments[index - 1].maxProb : -1;

      if (effectiveProb !== prevEffectiveProb || index === 0) {
        if (index > 0) textHtml += `</span>`;

        if (effectiveProb !== -1) {
          const styles = getColorByThreshold(effectiveProb, data.applied_threshold);
          textHtml += `<span style="${styles.bgStyle}">`;
        } else {
          textHtml += `<span>`;
        }
      }
      textHtml += seg.char.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });
    if (textSegments.length > 0) textHtml += `</span>`;

  } else {
    // ВАРИАНТ 2: Если fullText нет
    const sortedChunks = [...data.chunks].sort((a, b) => a.index - b.index);
    let combinedText = "";
    let charProbabilities = [];

    sortedChunks.forEach(chunk => {
      const snippet = chunk.text_snippet;

      let overlapLength = 0;
      for (let l = Math.min(combinedText.length, snippet.length); l > 0; l--) {
        if (combinedText.endsWith(snippet.substring(0, l))) {
          overlapLength = l;
          break;
        }
      }

      const uniquePart = snippet.substring(overlapLength);
      const startOverlapIndex = combinedText.length - overlapLength;

      for (let i = 0; i < overlapLength; i++) {
        if (chunk.ai_probability > charProbabilities[startOverlapIndex + i]) {
          charProbabilities[startOverlapIndex + i] = chunk.ai_probability;
        }
      }

      for (let i = 0; i < uniquePart.length; i++) {
        charProbabilities.push(chunk.ai_probability);
      }
      combinedText += uniquePart;
    });

    let currentProb = null;
    for (let i = 0; i < combinedText.length; i++) {
      const effectiveProb = charProbabilities[i] >= (data.applied_threshold / 2) ? charProbabilities[i] : -1;
      const prevEffectiveProb = i > 0 ? (charProbabilities[i - 1] >= (data.applied_threshold / 2) ? charProbabilities[i - 1] : -1) : null;

      if (effectiveProb !== prevEffectiveProb || i === 0) {
        if (i > 0) textHtml += `</span>`;

        if (effectiveProb !== -1) {
          const styles = getColorByThreshold(effectiveProb, data.applied_threshold);
          textHtml += `<span style="${styles.bgStyle} padding-left: 2px; padding-right: 2px;">`;
        } else {
          textHtml += `<span>`;
        }
      }
      textHtml += combinedText[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    if (combinedText.length > 0) textHtml += `</span>`;
  }

  // Создание HTML-структуры
  const container = document.createElement("div");
  container.className = "container my-5 d-flex flex-column align-items-center text-center";

  container.innerHTML = `
    <style>
      @keyframes fillCircle {
        from { stroke-dashoffset: ${circumference}; }
        to { stroke-dashoffset: ${strokeDashoffset}; }
      }
      .ai-circle-progress {
        stroke-dasharray: ${circumference};
        stroke-dashoffset: ${circumference};
        animation: fillCircle 1.2s ease-out forwards;
      }
    </style>

    <!-- Блок с круговым прогресс-баром светофора -->
    <div class="position-relative d-flex align-items-center justify-content-center mb-4" style="width: 140px; height: 140px;">
      <svg width="140" height="140" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
        <circle cx="50" cy="50" r="${radius}" fill="none" stroke="#e9ecef" stroke-width="8"/>
        <circle class="ai-circle-progress" cx="50" cy="50" r="${radius}" fill="none" stroke="${mainColor}" stroke-width="8" stroke-linecap="round"/>
      </svg>
      <div class="position-absolute d-flex align-items-center justify-content-center" style="inset: 0;">
        <span class="fs-2 fw-bold" style="color: ${mainColor}; line-height: 1;">${aiPercent}%</span>
      </div>
    </div>

    <!-- Метрики под кругом -->
    <div class="mb-4">
      <p class="mb-1 fs-5"><strong>${tr("AI Generated:")}</strong> <span class="badge" style="background-color: ${mainColor}; color: #ffffff;">${isAiText}</span></p>
      <p class="text-muted small"><strong>${tr("Strictness threshold:")}</strong> ${thresholdValue}</p>
    </div>

    <!-- Исходный текст без карточки -->
    <div class="w-100 text-start lh-lg mt-3" style="max-width: 700px; white-space: pre-wrap; font-size: 1.1rem;">
      ${textHtml}
    </div>
  `;

  return container

  // document.body.appendChild(container);
}