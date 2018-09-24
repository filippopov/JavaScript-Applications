let entriesService = (() => {

    function getAllByReceiptId(receiptId) {
        const endpoint = `entries?query={"receiptId":"${receiptId}"}`;

        return remote.get('appdata', endpoint, '');
    }

    function create(type, quantity, price, receiptId) {
        const data = { type, quantity, price, receiptId };

        return remote.post('appdata', 'entries', '', data);
    }

    function remove(entryId) {
        const endpoint = `entries/${entryId}`;

        return remote.remove('appdata', endpoint, '');
    }

    return {
        getAllByReceiptId,
        create,
        remove
    }
})();