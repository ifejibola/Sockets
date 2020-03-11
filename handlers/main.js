var fortune = require('../lib/fortune');

exports.flash = function (request, response, next) {
    response.locals.flash = request.session.flash;
    delete request.session.flash;
    next();
};

exports.home = function (request, response) {
    response.render('home');
};

exports.about = function (request, response) {
    response.render('about', { fortune: fortune.getFortune });
};

exports.chat = function (request, response) {
    response.render('chat');
}

exports.login = function (request, response) {
    response.render('login');
}
