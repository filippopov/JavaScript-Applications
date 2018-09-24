function startApp() {
    const ADS_DIV = $('#ads');

    $('header').find('a').show();

    function showView(view) {
        $('section').hide();

        switch (view){
            case 'home':
                $('#viewHome').show();
                break;
            case 'login':
                $('#viewLogin').show();
                break;
            case 'register':
                $('#viewRegister').show();
                break;
            case 'ads':
                $('#viewAds').show();
                loadAds();
                break;
            case 'create':
                $('#viewCreateAd').show();
                break;
            case 'details':
                $('#viewDetailsAd').show();
                break;
            case 'edit':
                $('#viewEditAd').show();
                break;
        }
    }

    function navigateTo(e) {
        $('section').hide();
        let target = $(e.target).attr('data-target');
        showView(target);
    }

    // Attach event listeners
    $('header').find('a[data-target]').on('click', navigateTo);
    $('#buttonLoginUser').on('click', login);
    $('#buttonRegisterUser').on('click', register);
    $('#linkLogout').on('click', logout);
    $('#buttonCreateAd').on('click', createAd);

    $(document).on({
        ajaxStart: () => $('#loadingBox').show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

    $('#infoBox').on('click', (event) => $(event.target).hide());
    $('#errorBox').on('click', (event) => $(event.target).hide());

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(() => $('#infoBox').fadeOut(), 3000);
    }

    function showError(message) {
        $('#errorBox').text(message);
        $('#errorBox').show();
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    showView('home');

    let requester = (() => {
        const APP_KEY = 'kid_SJBiQri4Q';
        const APP_SECRET = '000051d9e775488cbd5f5c51c9d8abd5';
        const BASE_URL = 'https://baas.kinvey.com/';

        function makeAuth(auth) {
            return (auth === 'basic') ? 'Basic ' + btoa(APP_KEY + ':' + APP_SECRET) : 'Kinvey ' + localStorage.getItem('authtoken');
        }

        function makeRequest(method, module, url, auth) {
            return {
                url: BASE_URL + module + '/' + APP_KEY + '/' + url,
                method,
                headers: {
                    'Authorization': makeAuth(auth)
                }
            }
        }

        function get(module, url, auth) {
            return $.ajax(makeRequest('GET', module, url, auth));
        }

        function post(module, url, data, auth) {
            let req = makeRequest('POST', module, url, auth);
            req.data = JSON.stringify(data);
            req.headers['Content-Type'] = 'application/json';
            return $.ajax(req);
        }

        function update(module, url, data, auth) {
            let req = makeRequest('PUT', module, url, auth);
            req.data = JSON.stringify(data);
            req.headers['Content-Type'] = 'application/json';
            return $.ajax(req);
        }

        function remove(module, url, auth) {
            return $.ajax(makeRequest('DELETE', module, url, auth));
        }

        return {
            get, post, update, remove
        }
    })();

    if (localStorage.getItem('authtoken') !== null && localStorage.getItem('username') !== null) {
        userLoggedIn();
    } else {
        userLoggedOut();
    }

    function userLoggedIn() {
        $('#loggedInUser').text(`Welcome, ${localStorage.getItem('username')}!`);
        $('#loggedInUser').show();
        $('#linkLogin').hide();
        $('#linkRegister').hide();
        $('#linkLogout').show();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
    }

    function userLoggedOut() {
        $('#loggedInUser').text(``);
        $('#loggedInUser').hide();
        $('#linkLogin').show();
        $('#linkRegister').show();
        $('#linkLogout').hide();
        $('#linkListAds').hide();
        $('#linkCreateAd').hide();
    }
    
    function saveSession(data) {
        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authtoken', data._kmd.authtoken);
        userLoggedIn();
    }

    async function login() {
        let form = $('#formLogin');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let res = await requester.post('user', 'login', {username, password}, 'basic');
            showInfo('Logged in');
            saveSession(res);
            showView('ads');
        } catch (error) {
            handleError(error);
        }

    }

    async function register() {
        let form = $('#formRegister');
        let username = form.find('input[name="username"]').val();
        let password = form.find('input[name="passwd"]').val();

        try {
            let res = await requester.post('user', '', {username, password}, 'basic');
            showInfo('Registered');
            saveSession(res);
            showView('ads');
        } catch (error) {
            handleError(error);
        }
    }

    async function logout() {
        try {
            let res = await requester.post('user', '_logout', {authtoken: localStorage.getItem('authtoken')});
            showInfo('Log out');
            localStorage.clear();
            userLoggedOut();
            showView('home');
        } catch (error) {
            handleError(error);
        }
    }

    async function loadAds() {
        let data = await requester.get('appdata', 'posts');
        ADS_DIV.empty();

        if (data.length === 0) {
            ADS_DIV.append('<p>No ads in database</p>');
            return;
        }

        let sortData = data.sort((a, b) => b['views'] - a['views']);

        for (let ad of sortData) {
            let html = $('<div>');
            html.addClass('ad-box');
            let title = $(`<div class="ad-title">${ad.tittle}</div>`);

            if (ad._acl.creator === localStorage.getItem('id')) {
                let deleteBtn = $('<button>&#10006;</button>').on('click', () => deleteAd(ad._id));
                deleteBtn.addClass('ad-control');
                title.append(deleteBtn);
                let editBtn = $('<button>&#9998;</button>').on('click', () => openEditAdd(ad));
                editBtn.addClass('ad-control');
                title.append(editBtn);
                let infoButton = $('<button>&#9776;</button>').on('click', () => infoAd(ad));
                infoButton.addClass('ad-control');
                title.append(infoButton);
            }

            html.append(title);

            html.append(`<div><img src="${ad.imageUrl}"></div>`);
            html.append(`<div>Price ${ad.price.toFixed(2)} | By ${ad.publisher}</div>`);
            ADS_DIV.append(html);
        }
    }

    async function deleteAd(id) {
        await requester.remove('appdata', 'posts/' + id);
        showInfo('Ad deleted');
        showView('ads');
    }

    function infoAd(ad) {
        showView('details');
        ad.views++;
        $('#title-info').text(ad.tittle);
        $('#description-info').text(ad.description);
        $('#publisher-info').text(ad.publisher);
        $('#price-info').text(ad.price);
        $('#date-info').text(ad.date);
        $('#views-info').text(ad.views);
        updateVies(ad);
    }

    async function updateVies(ad) {
        let tittle = ad.tittle;
        let description = ad.description;
        let publisher = ad.publisher;
        let price = ad.price;
        let date = ad.date;
        let views = ad.views;
        let imageUrl = ad.imageUrl;

        let editAd = {
            tittle, description, price, imageUrl, date, publisher, views
        };

        try {
            await requester.update('appdata', 'posts/' + ad._id, editAd);
        } catch (error) {
            handleError(error);
        }
    }
    
    function openEditAdd(ad) {
        let form = $('#formEditAd');
        form.find('input[name="title"]').val(ad.tittle);
        form.find('textarea[name="description"]').val(ad.description);
        form.find('input[name="price"]').val(Number(ad.price).toFixed(2));
        form.find('input[name="image"]').val(ad.imageUrl);

        let date = ad.date;
        let publisher = ad.publisher;
        let id = ad._id;
        let views = ad.views;

        form.find('#buttonEditAd').on('click', () => editAd(id, date, publisher, views));

        showView('edit');
    }

    async function editAd(id, date, publisher, views) {
        let form = $('#formEditAd');
        let title = form.find('input[name="title"]').val();
        let description = form.find('textarea[name="description"]').val();
        let price = form.find('input[name="price"]').val();
        price = Number(price);
        let imageUrl = form.find('input[name="image"]').val();

        if (title.length === 0) {
            showError('Tittle cannot be empty');
            return;
        }

        if (Number.isNaN(price)) {
            showError('Price cannot be empty');
            return;
        }
        views = Number(views);
        let editAd = {
            'tittle': title, description, price, imageUrl, date, publisher, views
        };

        try {
            await requester.update('appdata', 'posts/' + id, editAd);
            showInfo('Edit Ad');
            showView('ads');
        } catch (error) {
            handleError(error);
        }
    }
    
    async function createAd() {
        let form = $('#formCreateAd');
        let title = form.find('input[name="title"]').val();
        let description = form.find('textarea[name="description"]').val();
        let price = Number(form.find('input[name="price"]').val());
        let imageUrl = form.find('input[name="image"]').val();

        let date = (new Date()).toString('yyyy-MM-dd');
        let publisher = localStorage.getItem('username');
        let views = 0;

        if (title.length === 0) {
            showError('Tittle cannot be empty');
            return;
        }

        if (Number.isNaN(price)) {
            showError('Price cannot be empty');
            return;
        }

        let newAd = {
            'tittle': title, description, price, imageUrl, date, publisher, views
        };

        try {
            await requester.post('appdata', 'posts', newAd);
            showInfo('Ad created');
            showView('ads');
        } catch (error) {
            handleError(error);
        }
    }
}