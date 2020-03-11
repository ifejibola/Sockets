var main = require('./handlers/main');
var fs = require('fs');

module.exports = function (app) {

    app.use(main.flash);

    app.get('/', main.home);

    app.get('/about', main.about);

    app.get('/chat', main.chat);

    app.get('/login', main.login);

}