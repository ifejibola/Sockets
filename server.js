/*
    The main idea behind Socket.IO is tht you can send and receive any events you want, with
    any data you want. Any objects that can be encoded as JSON will do, binary too.
*/
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var credentials = require('./credentials');
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main', helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({ secret: credentials.cookieSecret, saveUninitialized: true, resave: false }));


app.set('port', process.env.PORT || 8000);

const nsp = io.of('/my-namespace');

nsp.on('connection', (socket) => {
    console.log('Someone connected to your custom namespace...');

    socket.join('testing');

    socket.on('private message', function (msg) {
        console.log('private nps: ' + msg);
        nsp.emit('private message', msg);
    });

    socket.on('disconnect', function () {
        console.log('user disconnected..');
    });
});
nsp.to('testing').emit('private message', 'everyone!!');

{
    // socket - listening for incoming sockets on the connection event
    // io.on('connection', function (socket) {
    //     console.log('A user connected ');

    //     //we print out the chat message event
    //     socket.on('chat message', function (msg) {
    //         console.log('message: ' + msg);

    //         //(Brodcasting) send msg to everyone, including the sender
    //         // next go to the client side script tag and capture the chat msg event to be included in the page
    //         io.emit('chat message', msg);
    //         // io.emit('chat message', 'helloooooooo!!!!!');

    //         // io.emit('hi', 'everyone..');
    //     });

    //     //Broadcasting - 
    //     //emit the event from the server to the rest of the users - using io.emit
    //     // io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

    //     /*
    //         if you want to send a message to everyone except for a certain emitting socket, we have
    //         the broadcast flag for emitting from that socket:
    //     */
    //     // socket.broadcast.emit('hi');

    //     //Custom event
    //     // socket.on('private message', function (from, msg) {
    //     //     console.log('I received a private msg by, ', from, ' saying: ', msg);
    //     // });

    //     //disconnect event
    //     socket.on('disconnect', function () {
    //         console.log('user disconnected..');
    //     })
    // });
}

{
    // restricting yourself to a namespace
    // var chat = io
    //     .of('/chat')
    //     .on('connection', function (socket) {
    //         socket.emit('a message', {
    //             that: 'only',
    //             '/chat': 'will get'
    //         });
    //         chat.emit('a message', {
    //             everyone: 'in',
    //             '/chat': 'will get'
    //         });
    //     });

    // var news = io.of('/news')
    //     .on('connection', function (socket) {
    //         socket.emit('item', { news: 'item' });
    //     });
}
require('./routes')(app);

//Serve static files
app.use(express.static(__dirname + '/public'), function (request, response) {
    response.type('png');
});

// 404 catch-all handler(middleware)
app.use(function (request, response) {
    response.status(404);
    response.send('404');
});

// 500 error handler(middleware)
app.use(function (err, request, response, next) {
    console.log(err.stack);
    response.status(500);
    response.send('500');
});

http.listen(app.get('port'), function () {
    console.log('Express running on port: ' + app.get('port'));
});