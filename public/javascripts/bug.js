LobbyView = Backbone.View.extend({
    el: "#content",
    initialize: function() {
	//this.render();
    }, 
    render: function() {
	var template = _.template($("#template_lobby").html(), {});

	window.socket.on('room_created', function(data) {
	    window.router.navigate("game/" + data.room, {trigger: true});
	});

	window.socket.on('game_list', function(data) {
	    console.log(data);
	    var template = _.template('<% for(id in games) { %><li><a href="#game/<%=id%>">Game #<%=id%></a></li><% } %>', {games: data});
	    $('.game-list').html(template);

	});

	this.$el.html(template);
	$('#new_game').click(function(event) {
	    event.preventDefault();
	    window.socket.emit('request_room');
	});

	window.socket.emit('join_lobby');
	return this;
    },
    remove: function() {
	this.$el.empty();
	return this;
    },
});

SQUARE_SIZE = 50;
PIECE_SIZE = SQUARE_SIZE - 5;
PIECE_OFFSET = (SQUARE_SIZE - PIECE_SIZE) / 2;
BOARD_SIZE = 8 * SQUARE_SIZE;
BANK_OFFSET = PIECE_SIZE + 10;
TEXT_OFFSET = (BOARD_SIZE - PIECE_SIZE * 5 - 10) / 5;

window.piece_cache = {};

function placePiece(board, name, place, bottom_color) {
    var i, j;
    i = place.charCodeAt(0) - 'A'.charCodeAt(0);
    j = 7 - (place.charCodeAt(1) - '1'.charCodeAt(0));

    //remove current piece
    if(board.pieces[place] != '' && board.pieces[place] != undefined) {
    	board.pieces[place].remove();
    }
    if (board.bottom_color == 'black') {
        // flip board if necessary
        i = 7 - i; j = 7 - j;
    }
    //console.log(name);
    var piece = board.piece_cache[name].clone().attr({x: (SQUARE_SIZE * i + PIECE_OFFSET), y: (SQUARE_SIZE * j + PIECE_OFFSET + BANK_OFFSET)});
    piece.name = name;
    piece.position = convertToTuple(place, board.bottom_color);
    piece.drag(move, start, up);
    board.pieces[place] = piece;

    return piece;
}

function getPieceAt(board, i, j) {
    // Get the center of the appropriate square
    var x = i * SQUARE_SIZE + PIECE_OFFSET;
    var y = j * SQUARE_SIZE + PIECE_OFFSET + BANK_OFFSET;
    var elements = board.getElementsByPoint(x, y);

    for (i in elements) {
        if (elements[i].type == "image")
            return elements[i];
    }

    return null;
}

function movePiece(board, from, to, name) {

    var op = convertToTuple(from, board.bottom_color),
    p = convertToTuple(to, board.bottom_color);
    var oi = op[0], oj = op[1], i = p[0], j = p[1];
    console.log('Making move from ' + oi + ', ' + oj + ' to ' + i + ', ' + j + ' ' + name);
    var piece = board.pieces[from];
    if (piece != "") {

        var new_piece = board.image('/images/pieces/' + name + '.svg',  SQUARE_SIZE * i + PIECE_OFFSET, SQUARE_SIZE * j + PIECE_OFFSET + BANK_OFFSET, PIECE_SIZE, PIECE_SIZE);
        new_piece.name = name;
        
        new_piece.position = convertToTuple(to, board.bottom_color);
        board.pieces[to] = new_piece;
        piece.remove();
        /*
          piece.attr("x", i * SQUARE_SIZE + PIECE_OFFSET);
          piece.attr("y", j * SQUARE_SIZE + PIECE_OFFSET + BANK_OFFSET);
        */
    }
}

function sendMove(board, oi, oj, i, j) {
    var op = convertFromTuple([oi, oj], board.bottom_color),
    p =  convertFromTuple([i, j], board.bottom_color);
    console.log('Attempting move from ' + op + ' to ' + p + ' on board ' + board.number);
    window.socket.emit('send_move', {'from': op, 'to': p, 'board': board.number});
}

// piece drag actions
var start = function(event) {
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({r: 70, opacity: 1}, 500, ">");
    console.log(JSON.stringify(this.position));
},
move = function(dx, dy) {
    var nowX, nowY;
    nowX = Math.max(0, this.ox + dx);
    nowY = Math.max(BANK_OFFSET, this.oy + dy);
    nowX = Math.min(BOARD_SIZE - PIECE_SIZE, nowX);
    nowY = Math.min(BOARD_SIZE + BANK_OFFSET - PIECE_SIZE, nowY); 
    this.attr({x: nowX, y: nowY});
},
up = function(event) {
    this.animate({r: 50, opacity: 1}, 500, ">");

    // get square center of piece is in
    var i = Math.floor(event.layerX / SQUARE_SIZE),
    j = Math.floor((event.layerY - BANK_OFFSET) / SQUARE_SIZE);

    if(0 <= i && i < 8 && 0 <= j && j < 8) {
        // if valid square, snap piece to center of square
        this.attr("x", SQUARE_SIZE * i + PIECE_OFFSET);
        this.attr("y", SQUARE_SIZE * j + PIECE_OFFSET + BANK_OFFSET);

        // Get the original position
        var oi = Math.floor(this.ox / SQUARE_SIZE);
        var oj = Math.floor(this.oy / SQUARE_SIZE);
        // console.log(this.position[0] + ' ' + this.position[1]);

        // update in pieces array;
        //this.paper.pieces[convertFromTuple([this.position[0], this.position[1]], this.paper.bottom_color)] = "";
        //this.paper.pieces[convertFromTuple([i,j], this.paper.bottom_color)] = this;

        sendMove(this.paper, this.position[0], this.position[1], i, j);
    } else {
        // otherwise return to original position
        this.attr("x", this.ox);
        this.attr("y", this.oy);
    }
};

var bankStart = function(event) {
    var new_bank_piece = this.clone().drag(bankMove, bankStart, bankUp);
    new_bank_piece.name = this.name;
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({r: 70, opacity: 1}, 500, ">");
};

var bankMove = function(dx, dy) {
    this.dragged = 1;
    var nowX, nowY;
    nowX = Math.max(0, this.ox + dx);
    nowY = Math.max(0, this.oy + dy);
    nowX = Math.min(BOARD_SIZE - PIECE_SIZE, nowX);
    nowY = Math.min(BOARD_SIZE + 2 * BANK_OFFSET - PIECE_SIZE, nowY); 
    this.attr({x: nowX, y: nowY});
};

var bankUp = function(event) {
    this.animate({r: 50, opacity: 1}, 500, ">");

    // get square center of piece is in
    var i = Math.floor(event.layerX / SQUARE_SIZE),
    j = Math.floor((event.layerY - BANK_OFFSET) / SQUARE_SIZE);

    if(0 <= i && i < 8 && 0 <= j && j < 8) {
        // if valid square, snap piece to center of square
        this.attr("x", SQUARE_SIZE * i + PIECE_OFFSET);
        this.attr("y", SQUARE_SIZE * j + PIECE_OFFSET + BANK_OFFSET);

        // Get the original position
        var oi = Math.floor(this.ox / SQUARE_SIZE);
        var oj = Math.floor(this.oy / SQUARE_SIZE);
        //this.remove();
        this.undrag();
        this.drag(move, start, up);
        //var loc = String.fromCharCode('A'.fromCharCode(0));


        var place = convertFromTuple([i, j], this.paper.bottom_color);


         window.socket.emit('send_move', {'from': 'bank', 
        	'to': place, 'piece': this.name, 'board': this.paper.number});
        this.remove();
    } else {
        // otherwise return to original position
        this.attr("x", this.ox);
        this.attr("y", this.oy);
    }
};

var setupBoard = function(board, bottom_color) {
    // intialize board rectangles
    var board_squares = {};
    var i, j;
    for (i = 0; i < 8; i++) {
        board_squares[i] = {};
        for (j = 0; j < 8; j++) {
            var fill_color = ((i + j) % 2 == 0) ? "#f0d9b5" : "#b58863"; // light brown : dark brown
            board_squares[i][j] = board.rect(i * SQUARE_SIZE, j * SQUARE_SIZE + BANK_OFFSET, SQUARE_SIZE, SQUARE_SIZE).attr({'stroke-width': 0, 'fill': fill_color});
        }
    }

    // make banks
    board.rect(0, 0, BOARD_SIZE, SQUARE_SIZE).attr({'stroke-width': 0, 'fill': "#EEE"});
    board.rect(0, BOARD_SIZE + SQUARE_SIZE + 10, BOARD_SIZE, SQUARE_SIZE).attr({'stroke-width': 0, 'fill': "#EEE"});
    var types = ['pawn', 'knight', 'bishop', 'rook', 'queen'];

    for(i = 0; i < types.length; i++) {
    	top_color = (board.bottom_color == 'white') ? 'black' : 'white';
    	var bank_piece = board.image('/images/pieces/' + top_color + ' ' + types[i] + '.svg', i * (PIECE_SIZE + TEXT_OFFSET) + PIECE_OFFSET, PIECE_OFFSET, PIECE_SIZE, PIECE_SIZE);
    	board.bank_texts[top_color + ' ' + types[i]] = board.text(i * (PIECE_SIZE + TEXT_OFFSET) + PIECE_SIZE + 5, PIECE_SIZE / 2 + 5, "x0").attr({"text-anchor":"start", "font-size":"18pt"});

    	bank_piece.drag(bankMove, bankStart, bankUp);
    	bank_piece.name = top_color + ' ' + types[i];
    	
    	var bank_piece2 = board.image('/images/pieces/' + bottom_color + ' ' + types[i] + '.svg', i * (PIECE_SIZE + TEXT_OFFSET) + PIECE_OFFSET, BOARD_SIZE + SQUARE_SIZE + 10 + PIECE_OFFSET, PIECE_SIZE, PIECE_SIZE);
    	board.bank_texts[bottom_color + ' ' + types[i]] = board.text(i * (PIECE_SIZE + TEXT_OFFSET) + PIECE_SIZE + 5, BOARD_SIZE + SQUARE_SIZE + 10 + PIECE_SIZE / 2 + 5, "x0").attr({"text-anchor":"start", "font-size":"18pt"});

    	bank_piece2.drag(bankMove, bankStart, bankUp);
    	bank_piece2.name = bottom_color + ' ' + types[i];
    }

    // console.log('board state');
    // console.log(board.state);
    // TODO: update with game state, right now just placing default board
    for (var place in board.state) {
    	// clear squares which should be empty
    	if(board.state[place] != '') {
	    var piece = placePiece(board, board.state[place], place, bottom_color);
	    piece.position = convertToTuple(place, board.bottom_color);
	    // console.log(board.state[place] + " " + JSON.stringify(piece.position));
	    board.pieces[place] = piece;
	    
	}
    }

    // console.log(board.pieces);
}


// stupid helper function
function emptyBoard() {
    var state = {}
    for(var i=0;i<8;i++) {
	for(var j=0;j<8;j++) {
	    state[convertFromTuple([i,j], 'white')] = '';
	}
    }
    return state;
}



GameView = Backbone.View.extend({
    el: "#content",
    gameId: null,
    initialize: function() {
	console.log('joined game ' + this.options.gameId);

	// join given room
	window.socket.emit('join_room', {room: this.options.gameId});

        socket.on('send_pid', function (data) {
            console.log("player is #" + data['id']);
            window.playerid = data['id'];
        });
    },
    render: function() {
		var template = _.template($("#template_game").html(), {});

		this.$el.html(template);
		this.boards = {};
		this.bottom_color = {};

		//TODO: should switch based on which board user is playing on...
		this.boards[0] = Raphael("board1_container", BOARD_SIZE, BOARD_SIZE + BANK_OFFSET * 2);
	    this.boards[1] = Raphael("board2_container", BOARD_SIZE, BOARD_SIZE + BANK_OFFSET * 2);
	    this.boards[0].bottom_color = 'white'; this.boards[1].bottom_color = 'black';
	    this.boards[0].pieces = emptyBoard(); this.boards[1].pieces = emptyBoard();
	    this.boards[0].state = emptyBoard(); this.boards[1].state = emptyBoard();
	    this.boards[0].bank = {white: {}, black: {}}; this.boards[1].bank = {white: {}, black: {}};
	    this.boards[0].number = 0; this.boards[1].number = 1;
	    this.boards[0].bank_texts = {}; this.boards[1].bank_texts = {};

		
		this.boards[0].piece_cache = {}; this.boards[1].piece_cache = {};
		var pt = ['pawn', 'king', 'queen', 'knight', 'bishop', 'rook'];
		for(var k=0;k<6;k++) {
			for(var b=0;b<=1;b++) {
				this.boards[b].piece_cache['white ' + pt[k]] = this.boards[b].image('/images/pieces/white ' + pt[k] + '.svg',  -500, -500, PIECE_SIZE, PIECE_SIZE);
				this.boards[b].piece_cache['black ' + pt[k]] = this.boards[b].image('/images/pieces/black ' + pt[k] + '.svg',  -500, -500, PIECE_SIZE, PIECE_SIZE);
			}
		}

	    window.socket.on('make_move', function(data) {
	        
	        movePiece(window.router.currentView.boards[data.board], data.from, data.to, data.name);
	    });

	    window.socket.on('send_state', function(data) {
	    	console.log('state received');
	    	console.log(data);
	    	window.router.currentView.boards[0].state = data.state[0];
	    	window.router.currentView.boards[1].state = data.state[1];

	    	setupBoard(window.router.currentView.boards[0], 'white');
			setupBoard(window.router.currentView.boards[1], 'black');
	    });
	    var fuckingReset = function(data) {
	    	// reset the fucking board
	    	for(var k=0;k<=1;k++){
		    	for(place in window.router.currentView.boards[k].state) {
		    		if(data[k][place] == "") {
		    			if(window.router.currentView.boards[k].pieces[place] != undefined && window.router.currentView.boards[k].pieces[place] != "") {
		    				console.log(place);
		    				console.log(window.router.currentView.boards[k].pieces[place]);
		    				window.router.currentView.boards[k].pieces[place].remove();
		    				window.router.currentView.boards[k].pieces[place] = "";
		    			}
		    		} else {
		    			var cp = window.router.currentView.boards[k].pieces[place];
		    			if( (cp != "" && cp != undefined) && cp.name != data[k][place]) {
		    				cp.remove();
		    				placePiece(window.router.currentView.boards[k], data[k][place], place);
		    			} else {
		    				placePiece(window.router.currentView.boards[k], data[k][place], place);
		    			}
		    		}
		    	}
		    }
	    }

	    window.socket.on('bad_move', function(data) {
	    	console.log('bad move');
	    	console.log(data);
	    	fuckingReset(data);
	    	
	    });

	    window.socket.on('good_move', function(data) {
	    	console.log('good_move');
	    	// reset the fucking board
	    	fuckingReset(data);
	    });

	return this;
    },
    remove: function() {
    	console.log('leaving game ' + this.options.gameId);
    	// join given room
	window.socket.emit('leave_room', {room: this.options.gameId});
    }
});

AppRouter = Backbone.Router.extend({
    initialize: function(el) {
	this.el = el;
	this.lobbyView = new LobbyView();
    },
    currentView: null,

    switchView: function(view) {
    	if(this.currentView != null)
    	    this.currentView.remove(); this.el.html(view.$el.html());
	view.render();
	this.currentView = view;
    },

    routes: {
	"lobby": "showLobby",
	"game/:id": "showGame"
    },

    showLobby: function() {
	this.switchView(this.lobbyView);
    },

    showGame: function(id) {

	this.switchView(new GameView({'gameId': id}));
    }
});

$(document).ready(function() {
    console.log('Making the socket');
    window.socket = io.connect('http://localhost:8001');
    window.router = new AppRouter($('#content'));

    Backbone.history.start();
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
// piece starting locations
var starting_places = {
    'A1': 'white rook',
    'B1': 'white knight',
    'C1': 'white bishop',
    'D1': 'white queen',
    'E1': 'white king',
    'F1': 'white bishop',
    'G1': 'white knight',
    'H1': 'white rook',

    'A2': 'white pawn',
    'B2': 'white pawn',
    'C2': 'white pawn',
    'D2': 'white pawn',
    'E2': 'white pawn',
    'F2': 'white pawn',
    'G2': 'white pawn',
    'H2': 'white pawn',

    'A7': 'black pawn',
    'B7': 'black pawn',
    'C7': 'black pawn',
    'D7': 'black pawn',
    'E7': 'black pawn',
    'F7': 'black pawn',
    'G7': 'black pawn',
    'H7': 'black pawn',

    'A8': 'black rook',
    'B8': 'black knight',
    'C8': 'black bishop',
    'D8': 'black queen',
    'E8': 'black king',
    'F8': 'black bishop',
    'G8': 'black knight',
    'H8': 'black rook',
};
