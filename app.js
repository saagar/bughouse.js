/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path')
, bg = require('./bughouseclient/bughouse')
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

// converts a space name like "A1" into an (i,j) tuple like (0,0)
var convertToTuple = function(space, bottom_color)
{   
    if(bottom_color == 'black')
        return [7 - (space.charCodeAt(0) - 'A'.charCodeAt(0)), space.charCodeAt(1) - '1'.charCodeAt(0)];
    else
        return [space.charCodeAt(0) - 'A'.charCodeAt(0), 7 - (space.charCodeAt(1) - '1'.charCodeAt(0))];
}

// inverse of previous function
var convertFromTuple = function(tuple, bottom_color) {
    if(bottom_color == 'black')
        return String.fromCharCode('A'.charCodeAt(0) + (7 - tuple[0]), '1'.charCodeAt(0) + tuple[1]);
    else
        return String.fromCharCode('A'.charCodeAt(0) + tuple[0], '1'.charCodeAt(0) + (7 - tuple[1]));
}


// stupid helper function
function emptyBoard() {
    var state = {}
    for(var i=0;i<8;i++) {
        for(var j=0;j<8;j++) {
            state[convertFromTuple([i,j], 'white')] = default_board[convertFromTuple([i,j], 'white')];
        }
    }
    return state;
}

var Game = function() {
    this.pieces = [emptyBoard(), emptyBoard()];
    this.bughouse = bg.bughouse();
    this.turns = ['white', 'white'];
    this.players = {};
    this.timer = null;
    this.started = false;

}

// keep state of all games
var games = {};

var games_played = 1;

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
    var room = null;

    var sendGames = function() {
        io.sockets.emit('game_list', games);
    }

    socket.on('request_room', function(data) {
        // create a new room
        games[games_played] = new Game();
        
        socket.emit('room_created', {room: games_played});
        games_played++;
        sendGames();
    });

    socket.on('join_room', function(data) {
        console.log('Joining ' + data.room);
        if(!(data.room in games)) {
            // create a new room
            games[data.room] = new Game();
            games_played++;
        }
        //console.log(games[data.room].bughouse.getJSON());

        games[data.room].players[playerId] = 1;
        socket.join(data.room);
        room = data.room;
        // add user to room
        console.log("new player is: " + playerId);
        socket.emit('send_state',  {id: playerId, state: games[data.room].bughouse.getJSON()});
    });

    var leaveRoom = function(roomName) {
        console.log(games[roomName].players);
        delete games[roomName].players[playerId];
        console.log(games[roomName].players);
        socket.leave(roomName);
    }

    socket.on('leave_room', function(data) {
        leaveRoom(data.room);
    });

    socket.on('send_move', function(data) {
        
        console.log('send_move ' + JSON.stringify(data));
        //console.log(games[room].pieces[data.board]);
        // update room state
        data.name = games[room].pieces[data.board][data.from];

        var move = '';
        move += data.board;
        move += games[room].bughouse.getPieceData(data.board, data.from)[0] == 0 ? 'w' : 'b';
        move += "_";
        move += data.from + "-" + data.to;
        console.log(move);
        console.log(games[room].bughouse.move(move));

        if(data.name.slice(0, 5) == games[room].turns[data.board]) {

            if(games[room].pieces[data.board][data.from] != '') {
                console.log('Updating state');
                games[room].pieces[data.board][data.to] = games[room].pieces[data.board][data.from];
                console.log(games[room].pieces[data.board][data.from]);
                games[room].pieces[data.board][data.from] = '';
                data.name = games[room].pieces[data.board][data.to];
            }

            console.log('Making move ' + JSON.stringify(data) + ' in game ' + room + ' on board ' + data.board);
            
            io.sockets.in(room).emit('make_move', data);
        }
    });

    socket.on('disconnect', function() {
        if(room != null) {
            leaveRoom(room);
        }
    });

});


var default_board = {
      "A1": "white rook",
      "B1": "white knight",
      "C1": "white bishop",
      "D1": "white queen",
      "E1": "white king",
      "F1": "white bishop",
      "G1": "white knight",
      "H1": "white rook",
      "A2": "white pawn",
      "B2": "white pawn",
      "C2": "white pawn",
      "D2": "white pawn",
      "E2": "white pawn",
      "F2": "white pawn",
      "G2": "white pawn",
      "H2": "white pawn",
      "A3": "",
      "B3": "",
      "C3": "",
      "D3": "",
      "E3": "",
      "F3": "",
      "G3": "",
      "H3": "",
      "A4": "",
      "B4": "",
      "C4": "",
      "D4": "",
      "E4": "",
      "F4": "",
      "G4": "",
      "H4": "",
      "A5": "",
      "B5": "",
      "C5": "",
      "D5": "",
      "E5": "",
      "F5": "",
      "G5": "",
      "H5": "",
      "A6": "",
      "B6": "",
      "C6": "",
      "D6": "",
      "E6": "",
      "F6": "",
      "G6": "",
      "H6": "",   
      "A7": "black pawn",
      "B7": "black pawn",
      "C7": "black pawn",
      "D7": "black pawn",
      "E7": "black pawn",
      "F7": "black pawn",
      "G7": "black pawn",
      "H7": "black pawn",
      "A8": "black rook",
      "B8": "black knight",
      "C8": "black bishop",
      "D8": "black queen",
      "E8": "black king",
      "F8": "black bishop",
      "G8": "black knight",
      "H8": "black rook",
    };