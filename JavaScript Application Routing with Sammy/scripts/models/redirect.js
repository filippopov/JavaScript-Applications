let redirect = (() => {
    function getURL() {
        console.log(window.location.href );
    }

    return {
        getURL
    };
})();