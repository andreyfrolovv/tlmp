export default function renderAiAnalysis(responseWrapper, fullText = null) {
  // Достаем данные с учетом вложенности объекта response
  const responseData = responseWrapper.response || responseWrapper;
  const { data } = responseData;

  if (!data) {
    console.error("renderAiAnalysis: Данные 'data' не найдены в объекте");
    return "";
  }

  const aiPercent = Math.round(data.ai_probability * 100);
  const thresholdValue = data.applied_threshold;

  // "Да" и "Нет" обернуты в функцию tr()
  const isAiText = data.is_ai ? tr("Yes") : tr("No");

  // Вспомогательная функция для очистки текста от спецсимволов (\r, \n, \t)
  function cleanSpecialChars(str) {
    if (!str) return "";
    return str.replace(/[\r\n\t]/g, "");
  }

  // Логика светофора: возвращает HEX-цвет для круга и стили ФОНА для текста
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
        hex: "#198754", // Зеленый
        bgStyle: "" // Зеленую зону НИКАК не выделяем фоном
      };
    }
  }

  // Главный статус для круга и бэджа
  const mainStatus = getColorByThreshold(data.ai_probability, data.applied_threshold);
  const mainColor = mainStatus.hex;

  // Контур блока с кодом всегда нейтральный прозрачно-черный
  const blockBorderColor = "#e9ecef";
  const blockShadow = "rgba(0, 0, 0, 0.08) 0px 4px 12px";

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (aiPercent / 100) * circumference;

  let textHtml = "";

  // Очищаем полный текст от спецсимволов
  const cleanedFullText = cleanSpecialChars(fullText);

  if (cleanedFullText) {
    let textSegments = [];
    for (let i = 0; i < cleanedFullText.length; i++) {
      textSegments.push({ char: cleanedFullText[i], maxProb: -1, hasChunk: false });
    }

    data.chunks.forEach(chunk => {
      const cleanSnippet = cleanSpecialChars(chunk.text_snippet).trim();
      if (!cleanSnippet) return;

      let startIndex = cleanedFullText.indexOf(cleanSnippet);
      while (startIndex !== -1) {
        for (let i = 0; i < cleanSnippet.length; i++) {
          const targetIndex = startIndex + i;
          if (targetIndex < textSegments.length) {
            textSegments[targetIndex].hasChunk = true;
            if (chunk.ai_probability > textSegments[targetIndex].maxProb) {
              textSegments[targetIndex].maxProb = chunk.ai_probability;
            }
          }
        }
        startIndex = cleanedFullText.indexOf(cleanSnippet, startIndex + 1);
      }
    });

    let currentMaxProb = null;
    let currentHasChunk = null;

    textSegments.forEach((seg, index) => {
      // Символ относится к выделяемой группе (желтый/красный) только если вероятность >= половины порога
      const effectiveProb = (seg.hasChunk && seg.maxProb >= (data.applied_threshold / 2)) ? seg.maxProb : -1;
      const prevEffectiveProb = (index > 0 && textSegments[index - 1].hasChunk && textSegments[index - 1].maxProb >= (data.applied_threshold / 2)) ? textSegments[index - 1].maxProb : -1;

      // Дополнительно разделяем желтую и красную зоны на разные теги span
      let isSameZone = true;
      if (effectiveProb !== -1 && prevEffectiveProb !== -1) {
        const currentIsRed = effectiveProb > data.applied_threshold;
        const prevIsRed = prevEffectiveProb > data.applied_threshold;
        isSameZone = currentIsRed === prevIsRed;
      }

      if (effectiveProb !== prevEffectiveProb || !isSameZone || index === 0) {
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
    // ВАРИАНТ 2: Если исходный fullText пустой, склеиваем чанки
    const sortedChunks = [...data.chunks].sort((a, b) => a.index - b.index);
    let combinedText = "";
    let charProbabilities = [];

    sortedChunks.forEach(chunk => {
      const snippet = cleanSpecialChars(chunk.text_snippet);
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

    let currentGroup = null;
    for (let i = 0; i < combinedText.length; i++) {
      const prob = charProbabilities[i];
      let group = -1; // -1 значит зеленый / без выделения
      if (prob > data.applied_threshold) group = 2; // Красный
      else if (prob >= (data.applied_threshold / 2)) group = 1; // Желтый

      if (group !== currentGroup || i === 0) {
        if (i > 0) textHtml += `</span>`;
        currentGroup = group;

        if (group !== -1) {
          const styles = getColorByThreshold(prob, data.applied_threshold);
          textHtml += `<span style="${styles.bgStyle} padding-left: 2px; padding-right: 2px;">`;
        } else {
          textHtml += `<span>`;
        }
      }
      textHtml += combinedText[i].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    if (combinedText.length > 0) textHtml += `</span>`;
  }

  // Возвращаем HTML-строку
  return `
    <div class="container my-5 d-flex flex-column align-items-center text-center">
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

      <!-- Круговой прогресс-бар -->
      <div class="position-relative d-flex align-items-center justify-content-center mb-4" style="width: 140px; height: 140px;">
        <svg width="140" height="140" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
          <circle cx="50" cy="50" r="${radius}" fill="none" stroke="#e9ecef" stroke-width="8"/>
          <circle class="ai-circle-progress" cx="50" cy="50" r="${radius}" fill="none" stroke="${mainColor}" stroke-width="8" stroke-linecap="round"/>
        </svg>
        <div class="position-absolute d-flex align-items-center justify-content-center" style="inset: 0;">
          <span class="fs-2 fw-bold" style="color: ${mainColor}; line-height: 1;">${aiPercent}%</span>
        </div>
      </div>

      <!-- Метрики -->
      <div class="mb-4">
        <p class="mb-1 fs-5"><strong>${tr("AI Generated:")}</strong> <span class="badge" style="background-color: ${mainColor}; color: #ffffff;">${isAiText}</span></p>
        <p class="text-muted small"><strong>${tr("Strictness threshold:")}</strong> ${thresholdValue}</p>
      </div>

      <!-- Блок с кодом и фоновым светофором (зеленый не выделяется) -->
      <div class="w-100 text-start mt-3" style="max-width: 700px;">
        <pre style="background-color: #f8f9fa; padding: 1rem; margin: 0; overflow-x: auto;"><code style="font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 0.95rem; white-space: pre-wrap;">${textHtml}</code></pre>
      </div>
    </div>
  `;
}