/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path')
, everyauth = require('everyauth');

var app = express();


app.configure(function() {
    app.set('port', process.env.PORT || 8001);

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});


var games = {};

var users = {};
var user_count = 0;

app.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

app.get('/lobby', function(req, res) {
    res.render('lobby', { title: 'Express' });
});

app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    console.log('Socket connected');
    var playerId = ++user_count;

    socket.on('join_room', function(data) {
        console.log('Joining ' + data.room);
        socket.join(data.room);
        // add user to room
        console.log("new player is: " + playerId);
        socket.emit('send_pid',  {id: playerId});
    });

    socket.on('send_move', function(data) {
        console.log('Making move ' + data);
        io.sockets.in('room').emit('make_move', data);
    });
});
