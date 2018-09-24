const handlers = {};

$(() => {
    // Define routes here using Sammy.js
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', handlers.getWelcomePage);
        this.get('#/home', handlers.getWelcomePage);

        this.post('#/register', handlers.registerUser);
        this.post('#/login', handlers.loginUser);
        this.get('#/logout', handlers.logout);

        this.get('#/catalog', handlers.getCatalog);
        this.get('#/create/post', handlers.createPostPage);

        this.post('#/create/post', handlers.createPost);

        this.get('#/edit/post/:postId', handlers.editPostPage);

        this.post('#/edit/post', handlers.editPost);
        this.get('#/delete/post/:postId', handlers.deletePost);

        this.get('#/details/:postId', handlers.getPosDetails);

        this.post('#/create/comment', handlers.createComment);

        this.get('#/comment/delete/:commentId/post/:postId', handlers.deleteComment);

        this.get('#/posts', handlers.getAllMyPosts);
    });

    app.run();
});