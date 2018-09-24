handlers.getWelcomePage = function (ctx) {
    ctx.isAuth = auth.isAuth();
    ctx.isNotAuth = !auth.isAuth();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        loginForm: './templates/forms/login-form.hbs',
        registerForm: './templates/forms/register-form.hbs',
        footer: './templates/common/footer.hbs',
        header: './templates/common/header.hbs'
    }).then(function () {
        this.partial('./templates/welcome-anonymous.hbs');
    })
};

handlers.registerUser = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let repeatPass = ctx.params.repeatPass;


    if (!/^[A-Za-z]{3,}$/.test(username)) {
        notify.showError('Username should be at least 3 characters long and contain only english alphabet letters');
        return;
    }

    if (!/^[A-Za-z\d]{6,}$/.test(password)) {
        notify.showError('Password should be at least 6 characters long and contain only english alphabet letters');
        return;
    }

    if (password !== repeatPass) {
        notify.showError('Passwords must match!');
        return;
    }

    auth.register(username, password)
        .then((userData) => {
            auth.saveSession(userData);
            notify.showInfo('User registration successful!');
            ctx.redirect('#/catalog');
        }).catch(notify.handleError);
};

handlers.loginUser = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;

    if (username.length === 0) {
        notify.showError('All fields should be non-empty!');
        return;
    }

    if (password.length === 0) {
        notify.showError('All fields should be non-empty!');
        return;
    }

    auth.login(username, password)
        .then((userData) => {
            auth.saveSession(userData);
            notify.showInfo('Login successful.');
            ctx.redirect('#/catalog');
        }).catch(notify.handleError);
};

handlers.logout = function (ctx) {
    auth.logout()
        .then(() => {
            sessionStorage.clear();
            notify.showInfo('Logout successful.');
            ctx.redirect('#/home');
        }).catch(notify.handleError);
};