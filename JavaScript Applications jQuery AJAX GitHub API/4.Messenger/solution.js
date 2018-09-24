function attachEvents() {
    const BASE_URL = "https://first-test-b1f53.firebaseio.com/messenger.json";
    const MESSAGES = $('#messages');
    const REFRESH = $('#refresh');
    const SUBMIT = $('#submit');
    const AUTHOR_INPUT = $('#author');
    const CONTENT_INPUT = $('#content');

    function addMessage() {
        let author = AUTHOR_INPUT.val();
        let content = CONTENT_INPUT.val();
        let timestamp = Date.now();

        let data = {author, content, timestamp};
        if (author !== '' && content !== '') {
            $.ajax({
                method: 'POST',
                url: BASE_URL,
                data: JSON.stringify(data)
            }).then(function () {
                AUTHOR_INPUT.val('');
                CONTENT_INPUT.val('');
                getMessages();
            }).catch(handleError);
        }
    }

    function getMessages() {
        $.ajax({
            method: 'GET',
            url: BASE_URL
        }).then(attachMessages).catch(handleError);
    }

    function attachMessages(messages) {
        MESSAGES.empty();
        let orderedMessages = {};
        messages = Object.keys(messages).sort((a,b) => a.timestamp - b.timestamp).forEach(k => orderedMessages[k] = messages[k]);
        for(let message of Object.keys(orderedMessages)){
            $('#messages').append(`${orderedMessages[message]['author']}: ${orderedMessages[message]['content']}\n`);
        }
    }

    function handleError(error) {
        console.log(error);
    }

    REFRESH.click(getMessages);
    SUBMIT.click(addMessage);

    getMessages();
}