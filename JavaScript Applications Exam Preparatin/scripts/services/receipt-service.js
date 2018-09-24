let receiptService = (() => {
    function getActive(userId) {
        let endpoint = `receipts?query={"_acl.creator":"${userId}","active":"true"}`;

        return remote.get('appdata', endpoint, '');
    }

    function create() {
        let data = {
            active: true,
            productsCount: 0,
            total: 0
        };

        return remote.post('appdata', 'receipts', '', data)
    }

    function getById(receiptId) {
        let endpoint = `receipts/${receiptId}`;

        return remote.get('appdata', endpoint, '');
    }

    async function checkout(receiptId, productCount, total) {
        let endpoint = `receipts/${receiptId}`;
        let receipt = await getById(receiptId);
        receipt['active'] = false;
        receipt['productsCount'] = productCount;
        receipt['total'] = total;

        return remote.update('appdata', endpoint, '', receipt);
    }

    function getMyReceipts(userId) {
        let endpoint = `receipts?query={"_acl.creator":"${userId}","active":"false"}`;

        return remote.get('appdata', endpoint, '');
    }

    return {
        getActive,
        create,
        getById,
        checkout,
        getMyReceipts
    }
})();