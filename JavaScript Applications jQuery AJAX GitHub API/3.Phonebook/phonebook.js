function attachEvents() {
    const BASE_URL = 'https://phonebook-nakov.firebaseio.com/phonebook';
    let phonebook = $('#phonebook');
    let btnLoad = $('#btnLoad');
    let person = $('#person');
    let phone = $('#phone');
    let btnCreate = $('#btnCreate');

    btnLoad.on('click', loadPhonebooks);
    btnCreate.on('click', createPhoneRow);


    function loadPhonebooks() {
        $.ajax({
            method: 'GET',
            url: BASE_URL + '.json'
        }).then(onLoadPhonebook)
        .catch(handleError);
    }

    function createPhoneRow() {
        let personVal = person.val();
        let phoneVal = phone.val();
        let phoneObj = {
            person: personVal,
            phone: phoneVal
        };

        $.ajax({
            method: 'POST',
            url: BASE_URL + '.json',
            data: JSON.stringify(phoneObj)
        }).then(function () {
            loadPhonebooks();
            person.val('');
            phone.val('');
        })
        .catch(handleError)
    }

    function onLoadPhonebook(data) {
        phonebook.empty();
        for (const rowIndex in data) {
            let li = $('<li>');
            let deleteButton = $('<button>').text('[Delete]');
            li.text(`${data[rowIndex]['person']}: ${data[rowIndex]['phone']} `);
            li.append(deleteButton);
            phonebook.append(li);
            deleteButton.on('click', function () {
                $.ajax({
                    method: 'DELETE',
                    url: BASE_URL + '/' + rowIndex + '.json'
                }).then(function () {
                    li.remove();
                })
                    .catch(handleError);
            })
        }
    }

    function handleError(error) {
        console.log(error);
    }
}