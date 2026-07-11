/**
 * Отрисовка виджета сходства текстов.
 */
export default function tmplForSeo(data) {
    const mainDiv = document.createElement('div');
    const dataSet = data.data;
    const health = dataSet.seo_health;
    const arcLength = 251.3;

    // Определяем цвет в зависимости от score
    let scoreColor = '#28a745'; // green
    if (health.score < 50) {
        scoreColor = '#dc3545'; // red
    } else if (health.score < 90) {
        scoreColor = '#ffc107'; // yellow
    }

    if (dataSet.seo_health) {
        mainDiv.innerHTML += `
<div class="row justify-content-center" style="padding:0;margin:0;">
    <div class="col-12 col-md-10 d-flex flex-column align-items-center" style="padding:0;margin:0;">
    <span class="small text-muted d-block fw-bold mb-3" style="padding:0;">URL: ${dataSet.url}</span>
        <div style="position: relative; width: 100%; max-width: 400px; aspect-ratio: 2 / 1; overflow: hidden; padding:0; margin:0;">
            <svg width="100%" height="100%" viewBox="0 0 200 100" style="display: block; padding:0;">
                <path d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e9ecef"
                    stroke-width="10"
                    stroke-linecap="round" />
                <path id="speedometer-progress-arc"
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="${scoreColor}"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${arcLength}"
                    stroke-dashoffset="${arcLength}"
                    style="transition: stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1);" />
            </svg>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; text-align: center; line-height: 1; padding:0;">
                <span class="fw-semibold" style="font-weight: bold; color: ${scoreColor}; transition: color 1.2s; font-size: calc(1.5rem + 1.4vw) !important; letter-spacing: -0.5px;">${health.score}</span>
            </div>
        </div>
            <div class="mt-4 text-center" style="padding:0;margin:0;">
            <span class="small text-muted d-block fw-bold mb-1" style="padding:0;">${tr("total_issues_found")}: ${health.total_issues_found}</span>
            <span class="small text-muted d-block fw-bold mb-1" style="padding:0;">${tr("critical_issues_count")}: ${health.critical_issues_count}</span>
            <span class="small text-muted d-block fw-bold mb-1" style="padding:0;">${tr("error_issues_count")}: ${health.error_issues_count}</span>
            <span class="small text-muted d-block fw-bold mb-1" style="padding:0;">${tr("warning_issues_count")}: ${health.warning_issues_count}</span>
        </div>
    </div>`;
    }

    Object.entries(dataSet).forEach(([key, values]) => {
        if (key === 'seo_health') return;

        if (typeof values === 'object' && values !== null && Object.keys(values).length !== 0) {
            mainDiv.innerHTML += createAccordion(key, values);
        }
    });

    setTimeout(() => {
        const progressArc = document.querySelector('#speedometer-progress-arc');
        if (progressArc) {
            progressArc.style.strokeDashoffset = arcLength - (arcLength * (health.score / 100));
        }
    }, 50);

    return mainDiv;
}

/**
 * Рекурсивно создаёт аккордеон для отображения данных
 */
function createAccordion(key, values, parentKey = null) {
    const isObject = typeof values === 'object' && values !== null;
    if (!isObject) return `<strong class="d-block mb-1" style="padding:0;">${key}: ${values}</strong>`;

    let subItems = '';
    let nestedAccordions = '';

    Object.entries(values).forEach(([k, v]) => {
        if (typeof v === 'object' && v !== null && Object.keys(v).length !== 0) {
            nestedAccordions += createAccordion(k, v, key);
        } else {
            if (!isNaN(k) && !isNaN(parseFloat(k))) {
                subItems += `<span class="small text-muted d-block fw-bold mb-1" style="padding:0;">${v}</span>`;
            } else {
                subItems += `<span class="small text-muted d-block fw-bold mb-1" style="padding:0;">${tr(k)}: ${v}</span>`;
            }
        }
    });

    let headerText;

    if (parentKey === 'html_validation' && !isNaN(key) && !isNaN(parseFloat(key))) {
        const typeValue = values?.type || 'unknown';
        headerText = `${tr('Type')}: ${typeValue}`;
    } else if (parentKey === 'issues') {
        headerText = `${tr('Level')}: ${tr(key)}`;
    } else {
        headerText = tr(key);
    }

    // Определяем, вложенный ли это аккордеон
    const isNested = parentKey !== null;

    const buttonClass = isNested
        ? 'accordion-button'
        : 'accordion-button collapsed';

    const collapseClass = isNested
        ? 'accordion-collapse collapse show'
        : 'accordion-collapse collapse';

    return `
    <div class="accordion mb-2" style="padding:0;">
        <div class="accordion-item" style="padding:0;">
            <h2 class="accordion-header" style="padding:0;">
                <button class="${buttonClass}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${key}" style="padding:0.5rem 1rem;">
                    <strong>${headerText}</strong>
                </button>
            </h2>
            <div id="collapse_${key}" class="${collapseClass}">
                <div class="accordion-body" style="padding:0;">
                    ${nestedAccordions}
                    ${subItems}
                </div>
            </div>
        </div>
    </div>`;
}