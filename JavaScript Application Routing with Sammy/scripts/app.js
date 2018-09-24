
$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/home', function() {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function(context) {
                this.partial('./templates/home/home.hbs');
            });
        });

        this.get('#/about', function() {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
            }).then(function(context) {
                this.partial('./templates/about/about.hbs');
            });
        });

        this.get('#/catalog',async function () {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            this.hasNoTeam = true;
            let teamId = sessionStorage.getItem('teamId');
            if (teamId) {
                this.hasNoTeam = false;
            }

            this.teams = await teamsService.loadTeams();

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                team: './templates/catalog/team.hbs'
            }).then(function(context) {
                this.partial('./templates/catalog/teamCatalog.hbs');
            });
        });

        this.get('#/catalog/:id', async function (ctx) {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            this.isOnTeam = false;
            let teamId = sessionStorage.getItem('teamId');
            if (teamId) {
                this.isOnTeam = true;
            }

            let id = ctx.params.id.substring(1);
            let team = await teamsService.loadTeamDetails(id);
            this.name = team.name;
            this.comment = team.comment;

            this.members = await teamsService.getTeamMembers(id);

            this.isAuthor = (team.author === sessionStorage.getItem('userId')) ? true : false;
            this.teamId = id;

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                teamControls: './templates/catalog/teamControls.hbs',
                teamMember: './templates/catalog/teamMember.hbs'
            }).then(function(context) {
                this.partial('./templates/catalog/details.hbs');
            });
        });

        this.get('#/edit/:teamId',async function(ctx) {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            let teamId = ctx.params.teamId.substring(1);
            let team = await teamsService.loadTeamDetails(teamId);
            this.name = team.name;
            this.comment = team.comment;
            this.teamId = teamId;

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                editForm: './templates/edit/editForm.hbs'
            }).then(function(context) {
                this.partial('./templates/edit/editPage.hbs');
            });
        });

        this.post('#/edit/:teamId', function(ctx) {
            let name = $('#name').val();
            let comment = $('#comment').val();
            let teamId = ctx.params.teamId.substring(1);
            let author = sessionStorage.getItem('userId');

            teamsService.edit(teamId, name, comment, author).then(() => {
                auth.showInfo('Successfully create team!');
                this.redirect('#/home');
            });
        });

        this.get('#/create', function() {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                createForm: './templates/create/createForm.hbs'
            }).then(function(context) {
                this.partial('./templates/create/createPage.hbs');
            });
        });

        this.post('#/create', function() {
            let name = $('#name').val();
            let comment = $('#comment').val();
            let author = sessionStorage.getItem('userId');

            teamsService.createTeam(name, comment, author).then((data) => {
                sessionStorage.setItem('teamId', data._id);
                teamsService.joinTeam(data._id).then(function () {
                    auth.showInfo('Successfully create team!');
                });
                this.redirect('#/home');
                auth.showInfo('Successfully create catalog!');
            })
        });

        this.get('#/login', function() {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                loginForm: './templates/login/loginForm.hbs'
            }).then(function(context) {
                this.partial('./templates/login/loginPage.hbs');
            });
        });

        this.post('#/login', function() {
            let username = $('#username').val();
            let password = $('#password').val();

            auth.login(username, password).then((data) => {
                auth.saveSession(data);
                this.redirect('#/home');
                auth.showInfo('Successfully login user!');
            }).catch(auth.handleError);
        });

        this.get('#/register', function() {
            this.username = sessionStorage.getItem('username');
            this.loggedIn = false;
            if (sessionStorage.getItem('userId')) {
                this.loggedIn = true;
            }

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                registerForm: './templates/register/registerForm.hbs'
            }).then(function(context) {
                this.partial('./templates/register/registerPage.hbs');
            });
        });
        
        this.post('#/register', function () {
            let username = $('#username').val();
            let password = $('#password').val();
            let repeatPassword = $('#repeatPassword').val();

            auth.register(username, password, repeatPassword).then((data) => {
                auth.saveSession(data);
                this.redirect('#/home');
                auth.showInfo('Successfully register user!');
            }).catch(auth.handleError);
        });

        this.get('#/logout', function () {
            auth.logout().then(() => {
                sessionStorage.clear();
                this.redirect('#/home');
                auth.showInfo('Successfully logout user!');
            }).catch(auth.handleError);
        })

        this.get('#/leave', function () {
            teamsService.leaveTeam().then(() => {
                sessionStorage.setItem('teamId', '');
                this.redirect('#/home');
                auth.showInfo('Successfully leave team!');
            }).catch(auth.handleError);
        })

        this.get('#/join/:teamId', function (ctx) {
            let teamId = ctx.params.teamId.substring(1);
            teamsService.joinTeam(teamId).then(() => {
                sessionStorage.setItem('teamId', 'teamId');
                this.redirect('#/home');
                auth.showInfo('Successfully join team!');
            }).catch(auth.handleError);
        })
    });

    app.run();
});