handlers.getWelcomePage = function (ctx) {
    ctx.loadPartials({
        loginForm: './templates/forms/login-form.hbs',
        registerForm: './templates/forms/register-form.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/welcome.hbs');
    })
};

handlers.registerUser = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    let passwordCheck = ctx.params.passwordCheck;

    if (username.length < 5) {
        notify.showError('Username must be at least 5 symbols long!');
        return;
    }

    if (password.length < 5) {
        notify.showError('Password must be non-empty!');
        return;
    }

    if (password !== passwordCheck) {
        notify.showError('Both passwords must match!');
        return;
    }

    auth.register(username, password)
        .then((userData) => {
            auth.saveSession(userData);
            notify.showInfo('User registration successful.');
            ctx.redirect('#/editor');
        }).catch(notify.handleError);
};

handlers.loginUser = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;

    if (username.length === 0) {
        notify.showError('Username is requried!');
        return;
    }

    if (password.length === 0) {
        notify.showError('Password is requried!');
        return;
    }

    auth.login(username, password)
        .then((userData) => {
            auth.saveSession(userData);
            notify.showInfo('Login successful.');
            ctx.redirect('#/editor');
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