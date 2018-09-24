handlers.getCatalog = function (ctx) {
    if (!auth.isAuth()) {
        ctx.redirect('#/home');
        return;
    }

    function calcTime(dateIsoFormat) {
        let diff = new Date - (new Date(dateIsoFormat));
        diff = Math.floor(diff / 60000);
        if (diff < 1) return 'less than a minute';
        if (diff < 60) return diff + ' minute' + pluralize(diff);
        diff = Math.floor(diff / 60);
        if (diff < 24) return diff + ' hour' + pluralize(diff);
        diff = Math.floor(diff / 24);
        if (diff < 30) return diff + ' day' + pluralize(diff);
        diff = Math.floor(diff / 30);
        if (diff < 12) return diff + ' month' + pluralize(diff);
        diff = Math.floor(diff / 12);
        return diff + ' year' + pluralize(diff);
        function pluralize(value) {
            if (value !== 1) return 's';
            else return '';
        }
    }

    posts.getAllPosts()
        .then((posts) => {
            posts.forEach((p, i) => {
                p.rank = i + 1;
                p.date = calcTime(p._kmd.ect);
                p.isAuthor = p._acl.creator === sessionStorage.getItem('userId');
            });

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.posts = posts;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                postList: './templates/posts/postList.hbs',
                post: './templates/posts/post.hbs'
            }).then(function () {
                this.partial('./templates/posts/catalogPage.hbs');
            })


        }).catch(notify.handleError);
};

handlers.createPostPage = function (ctx) {
    if (!auth.isAuth()) {
        ctx.redirect('#/home');
        return;
    }

    ctx.isAuth = auth.isAuth();
    ctx.username = sessionStorage.getItem('username');

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        navigation: './templates/common/navigation.hbs',
    }).then(function () {
        this.partial('./templates/posts/createPostPage.hbs');
    })
};

handlers.createPost = function (ctx) {
    if (!auth.isAuth()) {
        ctx.redirect('#/home');
        return;
    }

    let author = sessionStorage.getItem('username');
    let url = ctx.params.url;
    let imageUrl = ctx.params.imageUrl;
    let title = ctx.params.title;
    let description = ctx.params.description;

    if (title === '') {
        notify.showError('Title is required!');
        return;
    }

    if (url === '') {
        notify.showError('Url is required!');
        return;
    }

    // if (!url.startsWith('http')) {
    //     notify.showError('Url must be a valid link!');
    // }

    posts.createPost(author, title, description, url, imageUrl)
        .then(() => {
            notify.showInfo('Post created.');
            ctx.redirect('#/catalog');
        })
        .catch(notify.handleError);

};

handlers.editPostPage = function (ctx) {
    if (!auth.isAuth()) {
        ctx.redirect('#/home');
        return;
    }

    let postId = ctx.params.postId;

    posts.getPostById(postId)
        .then((post) => {
            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.post = post;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
            }).then(function () {
                this.partial('./templates/posts/editPostPage.hbs');
            })
        })

};

handlers.editPost = function (ctx) {
    let postId = ctx.params.postId;
    let author = sessionStorage.getItem('username');
    let url = ctx.params.url;
    let imageUrl = ctx.params.imageUrl;
    let title = ctx.params.title;
    let description = ctx.params.description;

    function postIsValid(title, url) {
        if (title === '') {
            notify.showError('Title is required!');
        } else if (url === '') {
            notify.showError('Url is required!');
        } else {
            return true;
        }

        return false;
    }

    if (postIsValid(title, url)) {
        posts.editPost(postId, author, title, description, url, imageUrl)
            .then(() => {
                notify.showInfo(`Post ${title} updated.`);
                ctx.redirect('#/catalog');
            })
            .catch(notify.showError);
    }
};


handlers.deletePost = function (ctx) {
    if (!auth.isAuth()) {
        ctx.redirect('#/home');
        return;
    }

    let postId = ctx.params.postId;

    posts.deletePost(postId)
        .then(() => {
            notify.showInfo('Post deleted.');
            ctx.redirect('#/catalog');
        })
        .catch(notify.handleError);
};

handlers.getPosDetails = function (ctx) {
    let postId = ctx.params.postId;

    const postPromise = posts.getPostById(postId);
    const allCommentsPromise = comments.getPostComments(postId);

    function calcTime(dateIsoFormat) {
        let diff = new Date - (new Date(dateIsoFormat));
        diff = Math.floor(diff / 60000);
        if (diff < 1) return 'less than a minute';
        if (diff < 60) return diff + ' minute' + pluralize(diff);
        diff = Math.floor(diff / 60);
        if (diff < 24) return diff + ' hour' + pluralize(diff);
        diff = Math.floor(diff / 24);
        if (diff < 30) return diff + ' day' + pluralize(diff);
        diff = Math.floor(diff / 30);
        if (diff < 12) return diff + ' month' + pluralize(diff);
        diff = Math.floor(diff / 12);
        return diff + ' year' + pluralize(diff);
        function pluralize(value) {
            if (value !== 1) return 's';
            else return '';
        }
    }

    Promise.all([postPromise, allCommentsPromise])
        .then(([post, comments]) => {
            post.date = calcTime(post._kmd.ect);
            post.isAuthor = post._acl.creator === sessionStorage.getItem('userId');

            comments.forEach((c) => {
                c.date = calcTime(c._kmd.ect);
                c.commentAuthor = c._acl.creator === sessionStorage.getItem('userId');
            });

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.post = post;
            ctx.comments = comments;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                postDetails: './templates/details/postDetails.hbs',
                comment: './templates/details/comment.hbs'
            }).then(function () {
                this.partial('./templates/details/postDetailsPage.hbs');
            })


        }).catch(notify.handleError);
};

handlers.createComment = function (ctx) {
    let author = sessionStorage.getItem('username');
    let content = ctx.params.content;
    let postId = ctx.params.postId;

    if (content === '') {
        notify.showError('Cannot add empty comment!');
        return;
    }

    comments.createComment(postId, content, author)
        .then(() => {
            notify.showInfo('Comment created!');
            ctx.redirect(`#/details/${postId}`);
        })
        .catch(notify.showError);
};

handlers.deleteComment = function (ctx) {
    let commentId = ctx.params.commentId;
    let postId = ctx.params.postId;

    comments.deleteComment(commentId)
        .then(() => {
            notify.showInfo('Comment deleted.');
            ctx.redirect(`#/details/${postId}`);
        })
        .catch(notify.handleError);
};

handlers.getAllMyPosts = function (ctx) {
    if (!auth.isAuth()) {
        ctx.redirect('#/home');
        return;
    }

    posts.getMyPosts(sessionStorage.getItem('username'))
        .then((posts) => {
            function calcTime(dateIsoFormat) {
                let diff = new Date - (new Date(dateIsoFormat));
                diff = Math.floor(diff / 60000);
                if (diff < 1) return 'less than a minute';
                if (diff < 60) return diff + ' minute' + pluralize(diff);
                diff = Math.floor(diff / 60);
                if (diff < 24) return diff + ' hour' + pluralize(diff);
                diff = Math.floor(diff / 24);
                if (diff < 30) return diff + ' day' + pluralize(diff);
                diff = Math.floor(diff / 30);
                if (diff < 12) return diff + ' month' + pluralize(diff);
                diff = Math.floor(diff / 12);
                return diff + ' year' + pluralize(diff);
                function pluralize(value) {
                    if (value !== 1) return 's';
                    else return '';
                }
            }

            posts.forEach((p, i) => {
                p.rank = i + 1;
                p.date = calcTime(p._kmd.ect);
                p.isAuthor = p._acl.creator === sessionStorage.getItem('userId');
            });

            ctx.isAuth = auth.isAuth();
            ctx.username = sessionStorage.getItem('username');
            ctx.posts = posts;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                postList: './templates/posts/postList.hbs',
                post: './templates/posts/post.hbs'
            }).then(function () {
                this.partial('./templates/posts/myPostsPage.hbs');
            });
        });
};