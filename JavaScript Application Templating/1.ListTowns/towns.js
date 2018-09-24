function attachEvents() {
    const BTN_LOAD_TOWNS = $('#btnLoadTowns');
    const TOWNS = $('#towns');
    const ROOT = $('#root');
    const TOWNS_TEMPLATE = $('#towns-template');

    BTN_LOAD_TOWNS.on('click', loadTowns);

    function loadTowns() {
        let towns = TOWNS.val()
            .split(', ')
            .map(e => ({name:e}));


        let source = TOWNS_TEMPLATE.html();
        let template = Handlebars.compile(source);
        let html = template({towns});
        TOWNS.val('');
        ROOT.empty();
        ROOT.append(html);
    }
}