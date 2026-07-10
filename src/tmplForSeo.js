/**
 * Отрисовка виджета сходства текстов.
 */
export default function tmplForSeo(data) {
    const mainDiv = document.createElement('div');
    const dataSet = data.data;
    const health = dataSet.seo_health;
    const arcLength = 251.3;

    if (dataSet.seo_health) {

        mainDiv.innerHTML += `
<div class="row justify-content-center">
    <div class="col-12 col-md-10 d-flex flex-column align-items-center">
    <span class="small text-muted d-block fw-bold mb-3">URL: ${dataSet.url}</span>
        <div style="position: relative; width: 100%; max-width: 400px; aspect-ratio: 2 / 1; overflow: hidden;">
            <svg width="100%" height="100%" viewBox="0 0 200 100" style="display: block;">
                <path d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e9ecef"
                    stroke-width="10"
                    stroke-linecap="round" />
                <path id="speedometer-progress-arc"
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="green"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${arcLength}"
                    stroke-dashoffset="${arcLength}"
                    style="transition: stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1);" />
            </svg>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; text-align: center; line-height: 1;">
                <span class="fw-semibold" style="font-weight: bold; color: green; transition: color 1.2s; font-size: calc(1.5rem + 1.4vw) !important; letter-spacing: -0.5px;">${health.score}</span>
            </div>
        </div>
            <div class="mt-4 text-center">
            <span class="small text-muted d-block fw-bold mb-1">${tr("total_issues_found")}: ${health.total_issues_found}</span>
            <span class="small text-muted d-block fw-bold mb-1">${tr("critical_issues_count")}: ${health.critical_issues_count}</span>
            <span class="small text-muted d-block fw-bold mb-1">${tr("error_issues_count")}: ${health.error_issues_count}</span>
            <span class="small text-muted d-block fw-bold mb-1">${tr("warning_issues_count")}: ${health.warning_issues_count}</span>
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
    if (!isObject) return `<strong class="d-block mb-1">${key}: ${values}</strong>`;

    let subItems = '';
    let nestedAccordions = '';

    Object.entries(values).forEach(([k, v]) => {
        if (typeof v === 'object' && v !== null && Object.keys(v).length !== 0) {
            nestedAccordions += createAccordion(k, v, key);
        } else {
            if (!isNaN(k) && !isNaN(parseFloat(k))) {
                subItems += `<span class="small text-muted d-block fw-bold mb-1">${v}</span>`;
            } else {
                subItems += `<span class="small text-muted d-block fw-bold mb-1">${tr(k)}: ${v}</span>`;
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

    return `
    <div class="accordion mb-2">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${key}">
                    <strong>${headerText}</strong>
                </button>
            </h2>
            <div id="collapse_${key}" class="accordion-collapse collapse">
                <div class="accordion-body">
                    ${nestedAccordions}
                    ${subItems}
                </div>
            </div>
        </div>
    </div>`;
}