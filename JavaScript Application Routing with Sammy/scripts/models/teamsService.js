let teamsService = (() => {
    function loadTeams() {
        // Request teams from db
        return requester.get('appdata', 'teams', 'kinvey');
    }

    function loadTeamDetails(teamId) {
        return requester.get('appdata', 'teams/' + teamId, 'kinvey');
    }

    function edit(teamId, name, description, author) {
        let teamData = {
            name: name,
            comment: description,
            author: author
        };

        return requester.update('appdata', 'teams/' + teamId, 'kinvey', teamData);
    }

    function createTeam(name, comment, author) {
        if (name === '') {
            auth.showError('Team Name cannot be empty');
            return;
        }

        let teamId = sessionStorage.getItem('teamId');

        if (teamId != '') {
            auth.showError('You cannot create team. Please leave your team');
            return;
        }

        let teamData = {
            name: name,
            comment: comment,
            author: author
        };

        return requester.post('appdata', 'teams', 'kinvey', teamData);
    }


    function joinTeam(teamId) {
        let userData = {
            username: sessionStorage.getItem('username'),
            teamId: teamId
        };

        return requester.update('user', sessionStorage.getItem('userId'), 'kinvey', userData);
    }

    function leaveTeam() {
        let userData = {
            username: sessionStorage.getItem('username'),
            teamId: ''
        };

       return requester.update('user', sessionStorage.getItem('userId'), userData, 'kinvey');
    }

    function getTeamMembers(teamId) {
        return requester.get('user', `?query={"teamId": "${teamId}"}`, 'kinvey');
    }


    return {
        loadTeams,
        loadTeamDetails,
        edit,
        createTeam,
        joinTeam,
        leaveTeam,
        getTeamMembers

    }
})();