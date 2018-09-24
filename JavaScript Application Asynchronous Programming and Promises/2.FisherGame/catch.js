function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_Sk3pB0FNX/biggestCatches';
    const USERNAME = 'filip';
    const PASSWORD = 'f';
    const BASE_64 = btoa(USERNAME + ':' + PASSWORD);
    const HEADERS = {"Authorization": 'Basic ' + BASE_64, 'Content-type': 'application/json'};

    const CREATE_BUTTON = $('#addForm .add');
    const ANGLER_INPUT = $('#addForm .angler');
    const WEIGHT_INPUT = $('#addForm .weight');
    const SPECIES_INPUT = $('#addForm .species');
    const LOCATION_INPUT = $('#addForm .location');
    const BAIT_INPUT = $('#addForm .bait');
    const CAPTURE_TIME = $('#addForm .captureTime');
    const LOAD_BUTTON = $('.load');
    const CATCHES_CONTEINER = $('#catches');

    CREATE_BUTTON.on('click', createCatches);
    LOAD_BUTTON.on('click', loadCatches);

    function updateRow() {
        let id = $(this).parent().attr('data-id');
        let angler = $(this).parent().find('.angler').val();
        let weight = Number($(this).parent().find('.weight').val());
        let species = $(this).parent().find('.species').val();
        let location = $(this).parent().find('.location').val();
        let bait = $(this).parent().find('.bait').val();
        let captureTime = Number($(this).parent().find('.captureTime').val());

        let data = {angler, weight, species, location, bait, captureTime};

        $.ajax({
            method: 'PUT',
            url: URL + `/${id}`,
            headers: HEADERS,
            data: JSON.stringify(data)
        }).then(function () {
            loadCatches();
        }).catch(handleError);
    }

    function deleteCatches() {
        let id = $(this).parent().attr('data-id');

        $.ajax({
            method: 'DELETE',
            url: URL + `/${id}`,
            headers: HEADERS
        }).then(deleteItem).catch(handleError);
    }

    function deleteItem() {
        loadCatches();
    }

    function loadCatches() {
        $.ajax({
            method: 'GET',
            url: URL,
            headers: HEADERS
        }).then(renderInformation).catch(handleError);
    }

    function renderInformation(data) {
        CATCHES_CONTEINER.empty();
        for (let rowIndex in data) {
            let conteiner = $('<div>').addClass('catch').attr('data-id', data[rowIndex]['_id']);
            conteiner.append($('<label>Angler</label>'));
            conteiner.append($('<input type="text" class="angler"/>').val(data[rowIndex]['angler']));
            conteiner.append($('<label>Weight</label>'));
            conteiner.append($('<input type="number" class="weight"/>').val(data[rowIndex]['weight']));
            conteiner.append($('<label>Species</label>'));
            conteiner.append($('<input type="text" class="species"/>').val(data[rowIndex]['species']));
            conteiner.append($('<label>Location</label>'));
            conteiner.append($('<input type="text" class="location"/>').val(data[rowIndex]['location']));
            conteiner.append($('<label>Bait</label>'));
            conteiner.append($('<input type="text" class="bait"/>').val(data[rowIndex]['bait']));
            conteiner.append($('<label>Capture Time</label>'));
            conteiner.append($('<input type="number" class="captureTime"/>').val(data[rowIndex]['captureTime']));
            let deleteButton = $('<button class="delete">Delete</button>');
            deleteButton.on('click', deleteCatches);
            let updateButton = $('<button class="update">Update</button>');
            updateButton.on('click', updateRow);
            conteiner.append(updateButton);
            conteiner.append(deleteButton);
            CATCHES_CONTEINER.append(conteiner);
        }
    }

    function createCatches() {
        let angler = ANGLER_INPUT.val();
        let weight = Number(WEIGHT_INPUT.val());
        let species = SPECIES_INPUT.val();
        let location = LOCATION_INPUT.val();
        let bait = BAIT_INPUT.val();
        let captureTime = Number(CAPTURE_TIME.val());

        let data = {angler, weight, species, location, bait, captureTime};

        $.ajax({
            method: 'POST',
            url: URL,
            headers: HEADERS,
            data: JSON.stringify(data)
        }).then(successfulyCreateRow).catch(handleError);
    }

    function successfulyCreateRow(data) {
        ANGLER_INPUT.val('');
        WEIGHT_INPUT.val('');
        SPECIES_INPUT.val('');
        LOCATION_INPUT.val('');
        BAIT_INPUT.val('');
        CAPTURE_TIME.val('');
        loadCatches();
    }

    function handleError(error) {
        console.log(error);
    }
}