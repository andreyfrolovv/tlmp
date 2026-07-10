/**
 * Отрисовка виджета сходства текстов.
 * @param {Object} data - Данные ответа от сервера.
 */
export default function tmplForSeo(data) {
    let mainDiv = document.createElement('div');
    let dataJson = data.data;
    let seo_health = data.data.seo_health;
    let issues = data.data.issues;
    let basic_seo = data.data.basic_seo;
    let headings = data.data.headings.all_headings;
    let recommendations = data.data.recommendations;
    let html_validation = data.data.html_validation;
    let content_quality = data.data.content_quality;
    let images = data.data.images;
    let links = data.data.links;
    let social_media_tags = data.data.social_media_tags;
    let structured_data = data.data.structured_data;

    const arcLength = 251.2;

    mainDiv.innerHTML = `
<div class="row justify-content-center">
    <div class="col-12 col-md-10 d-flex flex-column align-items-center">
    <span class="small text-muted d-block fw-bold mb-3">URL: ${dataJson.url}</span>
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
            <span class="fw-semibold" style="font-weight: bold; color: green; transition: color 1.2s; font-size: calc(1.5rem + 1.4vw) !important; letter-spacing: -0.5px;">${seo_health.score}</span>
          </div>
        </div>
                <div class="mt-4 text-center">
          <span class="small text-muted d-block fw-bold mb-1">${tr("total_issues_found")}: ${seo_health.total_issues_found}</span>
          <span class="small text-muted d-block fw-bold mb-1">${tr("critical_issues_count")}: ${seo_health.critical_issues_count}</span>
          <span class="small text-muted d-block fw-bold mb-1">${tr("error_issues_count")}: ${seo_health.error_issues_count}</span>
          <span class="small text-muted d-block fw-bold mb-1">${tr("warning_issues_count")}: ${seo_health.warning_issues_count}</span>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-issues" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_issues" aria-expanded="false" aria-controls="collapse_issues">
                    <strong>${tr('issue')}</strong>
                </button>
            </h2>
            <div id="collapse_issues" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="issues"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-recommendations" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_recommendations" aria-expanded="false" aria-controls="collapse_recommendations">
                    <strong>${tr('recommendations')}</strong>
                </button>
            </h2>
            <div id="collapse_recommendations" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="recommendations"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-html_validation" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_html_validation" aria-expanded="false" aria-controls="collapse_html_validation">
                    <strong>${tr('html_validation')}</strong>
                </button>
            </h2>
            <div id="collapse_html_validation" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="html_validation"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div> 
    <div class="accordion">
        <div id="accordion-basic_seo" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_basic_seo" aria-expanded="false" aria-controls="collapse_basic_seo">
                    <strong>${tr('basic_seo')}</strong>
                </button>
            </h2>
            <div id="collapse_basic_seo" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="basic_seo"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-headings" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_headings" aria-expanded="false" aria-controls="collapse_headings">
                    <strong>${tr('headings')}</strong>
                </button>
            </h2>
            <div id="collapse_headings" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="headings"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-headings" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_content_quality" aria-expanded="false" aria-controls="collapse_content_quality">
                    <strong>${tr('content_quality')}</strong>
                </button>
            </h2>
            <div id="collapse_content_quality" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="content_quality"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>    
    <div class="accordion">
        <div id="accordion-images" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_images" aria-expanded="false" aria-controls="collapse_images">
                    <strong>${tr('images')}</strong>
                </button>
            </h2>
            <div id="collapse_images" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="images"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-links" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_links" aria-expanded="false" aria-controls="collapse_links">
                    <strong>${tr('links')}</strong>
                </button>
            </h2>
            <div id="collapse_links" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="links"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-social_media_tags" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_social_media_tags" aria-expanded="false" aria-controls="collapse_social_media_tags">
                    <strong>${tr('social_media_tags')}</strong>
                </button>
            </h2>
            <div id="collapse_social_media_tags" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="social_media_tags"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="accordion">
        <div id="accordion-structured_data" class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_structured_data" aria-expanded="false" aria-controls="collapse_structured_data">
                    <strong>${tr('structured_data')}</strong>
                </button>
            </h2>
            <div id="collapse_structured_data" class="accordion-collapse collapse">
                <div class="accordion">
                    <div id="structured_data"  class="accordion-item">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
    let i_issues = 0
    issues.sort((a, b) => b.level - a.level);

    issues.forEach(issue => {
        let issuesElement = mainDiv.querySelector('#issues')
        issuesElement.innerHTML += `                
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${i_issues}" aria-expanded="false" aria-controls="collapse_${i_issues}">
                    <span><strong>${tr('Level')}:${issue.level}</strong> ${issue.message}</span>
                </button>
            </h2>
            <div id="collapse_${i_issues}" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <span><strong>${tr('element_type')}:</strong> ${issue.element_type}</span>
                    <br>
                    <span><strong>${tr('details')}:</strong> ${issue.details}</span>
                    <br>
                    <span><strong>${tr('recommendation')}:</strong> ${issue.recommendation}</span>
                </div>
            </div>
    `
        i_issues++
    })

    recommendations.forEach(recommendation => {
        mainDiv.querySelector('#recommendations').innerHTML += `
        <span class="small text-muted d-block fw-bold mb-1">${recommendation}</span>
        `
    })

    let i_html_validation = 0;

    html_validation.forEach(html_error => {
        mainDiv.querySelector('#html_validation').innerHTML += `
                    <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${i_html_validation}" aria-expanded="false" aria-controls="collapse_${i_html_validation}">
                    <span><strong>${tr('type')}:${html_error.type}</strong></span>
                </button>
            </h2>
            <div id="collapse_${i_html_validation}" class="accordion-collapse collapse">
                <div class="accordion-body">
                    <span><strong>${tr('lastLine')}:</strong> ${html_error.lastLine}</span>
                    <br>
                    <span><strong>${tr('lastColumn')}:</strong> ${html_error.lastColumn}</span>
                    <br>
                    <span><strong>${tr('firstColumn')}:</strong> ${html_error.firstColumn}</span>
                    <br>
                    <span><strong>${tr('message')}:</strong> ${html_error.message}</span>
                    <br>
                    <span><strong>${tr('extract')}:</strong> ${html_error.extract}</span>
                    <br>
                    <span><strong>${tr('hiliteStart')}:</strong> ${html_error.hiliteStart}</span>
                    <br>
                    <span><strong>${tr('hiliteLength')}:</strong> ${html_error.hiliteLength}</span>   
                </div>
            </div>
        `

        i_html_validation++
    })

    mainDiv.querySelector('#basic_seo').innerHTML = `
                        <span class="small text-muted d-block fw-bold mb-1">${tr("title")}: ${basic_seo.title}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("title_length")}: ${basic_seo.title_length}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("meta_description")}: ${basic_seo.meta_description}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("meta_description_length")}: ${basic_seo.meta_description_length}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("meta_robots")}: ${basic_seo.meta_robots}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("canonical_url")}: ${basic_seo.canonical_url}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("viewport")}: ${basic_seo.viewport}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("charset")}: ${basic_seo.charset}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("html_lang")}: ${basic_seo.html_lang}</span>
                    <span class="small text-muted d-block fw-bold mb-1">${tr("favicon_url")}: ${basic_seo.favicon_url}</span>
    `

    Object.entries(headings).forEach(([key, values]) => {
        mainDiv.querySelector('#headings').innerHTML += `<strong>${key}:</strong> ${values.join(', ')}<br>`;
    });

    Object.entries(content_quality).forEach(([key, values]) => {
        if (key === 'keyword_density_top_10_with_bigrams') {
            // 1. Создаем контейнер для аккордеона
            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'accordion mb-3'; // Добавили отступ снизу для красоты

            // 2. Вставляем структуру аккордеона
            accordionContainer.innerHTML = `
            <div id="accordion-keyword_density_top_10_with_bigrams" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_keyword_density_top_10_with_bigrams" aria-expanded="false" aria-controls="collapse_keyword_density_top_10_with_bigrams">
                        <strong>${tr('keyword_density_top_10_with_bigrams')}</strong>
                    </button>
                </h2>
                <div id="collapse_keyword_density_top_10_with_bigrams" class="accordion-collapse collapse">
                    <div class="accordion-body" id="keyword_density_top_10_with_bigrams_body">
                        <!-- Сюда вставим внутренности -->
                    </div>
                </div>
            </div>
        `;

            // 3. Заполняем внутренности аккордеона (собираем в строку, чтобы не спамить DOM)
            let innerHtml = '';
            Object.entries(values).forEach(([innerKey, innerValue]) => {
                innerHtml += `<strong>${innerKey}: ${innerValue}</strong><br>`;
            });

            accordionContainer.querySelector('#keyword_density_top_10_with_bigrams_body').innerHTML = innerHtml;

            // 4. ВСТАВЛЯЕМ НА САМЫЙ ВЕРХ контейнера через prepend
            mainDiv.querySelector('#content_quality').prepend(accordionContainer);
            return;
        }

        // Обычные элементы просто добавляем в конец через innerHTML += или append
        mainDiv.querySelector('#content_quality').innerHTML += `
        <span class="small text-muted d-block fw-bold mb-1">${tr(`${key}`)}: ${values}</span>
    `;
    });

    Object.entries(images).forEach(([key, values]) => {
        mainDiv.querySelector('#images').innerHTML += `<strong>${tr(key)}:</strong> ${values}<br>`;
    });

    Object.entries(links).forEach(([key, values]) => {
        if (key === 'anchor_text_distribution_percent') {
            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'accordion mb-3';

            accordionContainer.innerHTML = `
            <div id="accordion-anchor_text_distribution_percent" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_anchor_text_distribution_percent" aria-expanded="false" aria-controls="collapse_anchor_text_distribution_percent">
                        <strong>${tr('anchor_text_distribution_percent')}</strong>
                    </button>
                </h2>
                <div id="collapse_anchor_text_distribution_percent" class="accordion-collapse collapse">
                    <div class="accordion-body" id="anchor_text_distribution_percent">
                    </div>
                </div>
            </div>
        `;

            // 3. Заполняем внутренности аккордеона (собираем в строку, чтобы не спамить DOM)
            let innerHtml = '';
            Object.entries(values).forEach(([innerKey, innerValue]) => {
                innerHtml += `<strong>${innerKey}: ${innerValue}</strong><br>`;
            });

            accordionContainer.querySelector('#anchor_text_distribution_percent').innerHTML = innerHtml;

            // 4. ВСТАВЛЯЕМ НА САМЫЙ ВЕРХ контейнера через prepend
            mainDiv.querySelector('#links').prepend(accordionContainer);
            return;
        }
        mainDiv.querySelector('#links').innerHTML += `<strong>${tr(key)}:</strong> ${values}<br>`;
    });

    Object.entries(social_media_tags).forEach(([key, values]) => {
        if (Array.isArray(values)) {
            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'accordion mb-3';

            accordionContainer.innerHTML = `
            <div id="accordion-${key}" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${key}" aria-expanded="false" aria-controls="collapse_${key}">
                        <strong>${tr(key)}</strong>
                    </button>
                </h2>
                <div id="collapse_${key}" class="accordion-collapse collapse">
                    <div class="accordion-body" id="${key}">
                    </div>
                </div>
            </div>
        `;

            // 3. Заполняем внутренности аккордеона (собираем в строку, чтобы не спамить DOM)
            let innerHtml = '';
            Object.entries(values).forEach(([innerKey, innerValue]) => {
                innerHtml += `<strong>${innerKey}: ${innerValue}</strong><br>`;
            });

            accordionContainer.querySelector('#' + key).innerHTML = innerHtml;

            // 4. ВСТАВЛЯЕМ НА САМЫЙ ВЕРХ контейнера через prepend
            mainDiv.querySelector('#social_media_tags').prepend(accordionContainer);
            return;
        } else if (typeof values === 'object' && values !== null) {
            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'accordion mb-3';

            accordionContainer.innerHTML = `
            <div id="accordion-${key}" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${key}" aria-expanded="false" aria-controls="collapse_${key}">
                        <strong>${tr(key)}</strong>
                    </button>
                </h2>
                <div id="collapse_${key}" class="accordion-collapse collapse">
                    <div class="accordion-body" id="${key}">
                    </div>
                </div>
            </div>
        `;

            let innerHtml = '';
            Object.entries(values).forEach(([innerKey, innerValue]) => {
                innerHtml += `<strong>${innerKey}: ${innerValue}</strong><br>`;
            });


            accordionContainer.querySelector('#' + key).innerHTML = innerHtml;
            mainDiv.querySelector('#social_media_tags').prepend(accordionContainer);

            return;
        }
        mainDiv.querySelector('#social_media_tags').innerHTML += `<strong>${tr(key)}:</strong> ${values}<br>`;
    });

    Object.entries(structured_data).forEach(([key, values]) => {
        if (Array.isArray(values)) {
            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'accordion mb-3';

            accordionContainer.innerHTML = `
            <div id="accordion-${key}" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${key}" aria-expanded="false" aria-controls="collapse_${key}">
                        <strong>${tr(key)}</strong>
                    </button>
                </h2>
                <div id="collapse_${key}" class="accordion-collapse collapse">
                    <div class="accordion-body" id="${key}">
                    </div>
                </div>
            </div>
        `;

            // 3. Заполняем внутренности аккордеона (собираем в строку, чтобы не спамить DOM)
            let innerHtml = '';
            Object.entries(values).forEach(([innerKey, innerValue]) => {
                innerHtml += `<strong>${innerKey}: ${innerValue}</strong><br>`;
            });

            accordionContainer.querySelector('#' + key).innerHTML = innerHtml;

            // 4. ВСТАВЛЯЕМ НА САМЫЙ ВЕРХ контейнера через prepend
            mainDiv.querySelector('#structured_data').prepend(accordionContainer);
            //return;
        } else if (typeof values === 'object' && values !== null) {
            const accordionContainer = document.createElement('div');
            accordionContainer.className = 'accordion mb-3';

            accordionContainer.innerHTML = `
            <div id="accordion-${key}" class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${key}" aria-expanded="false" aria-controls="collapse_${key}">
                        <strong>${tr(key)}</strong>
                    </button>
                </h2>
                <div id="collapse_${key}" class="accordion-collapse collapse">
                    <div class="accordion-body" id="${key}">
                    </div>
                </div>
            </div>
        `;

            let innerHtml = '';
            Object.entries(values).forEach(([innerKey, innerValue]) => {
                innerHtml += `<strong>${innerKey}: ${innerValue}</strong><br>`;
            });


            accordionContainer.querySelector('#' + key).innerHTML = innerHtml;
            mainDiv.querySelector('#structured_data').prepend(accordionContainer);

        }
        //mainDiv.querySelector('#social_media_tags').innerHTML += `<strong>${tr(key)}:</strong> ${values}<br>`;
    });

    setTimeout(() => {
        const progressArc = document.querySelector('#speedometer-progress-arc');
        if (progressArc) {
            progressArc.style.strokeDashoffset = arcLength - (arcLength * (seo_health.score / 100));
        }
    }, 50);

    return mainDiv
}