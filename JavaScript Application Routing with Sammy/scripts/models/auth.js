let auth = (() => {
    async function saveSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authtoken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        let teamId = (!userInfo.teamId) ? '' : userInfo.teamId;
        sessionStorage.setItem('teamId', teamId);
    }

    // user/login
    function login(username, password) {
        if (username === '') {
            showError('Please enter username');
            return;
        }

        if (password === '') {
            showError('Please enter password');
            return;
        }

        let userData = {
            username,
            password
        };

        return requester.post('user', 'login', 'basic', userData);
    }

    // user/register
    function register(username, password, repeatPassword) {
        if (username === '') {
            showError('Please enter username');
            return;
        }

        if (password === '') {
            showError('Please enter password');
            return;
        }

        if (password !== repeatPassword) {
            showError('Password and Repeat Password do not match');
            return;
        }

        let userData = {
            username,
            password
        };

        return requester.post('user', '', 'basic', userData);
    }

    // user/logout
    function logout() {
        let logoutData = {
            authtoken: sessionStorage.getItem('authtoken')
        };

        return requester.post('user', '_logout', 'kinvey', logoutData);
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    return {
        login,
        register,
        logout,
        saveSession,
        showInfo,
        showError,
        handleError
    }
})()