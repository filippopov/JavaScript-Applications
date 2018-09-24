$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        const CAT_TEMPLATE = $('#cat-template');
        const ALL_CATS = $('#allCats');

        let template = Handlebars.compile(CAT_TEMPLATE.html());
        let html = template({cats: window.cats});
        ALL_CATS.append(html);

        $('.btn-primary').on('click', toggleStatusCode);

        function toggleStatusCode() {
            ($(this).text() === 'Show status code') ? $(this).text('Hide status code') : $(this).text('Show status code');
            $(this).parent().find('div').toggle();
        }
    }
});