LobbyView = Backbone.View.extend({
    el: "#content",
    initialize: function() {
	//this.render();
    }, 
    render: function() {
	var template = _.template($("#template_lobby").html(), {});
	this.$el.html(template);
	return this;
    },
    remove: function() {
	this.$el.empty();
	return this;
    },
});

SQUARE_SIZE = 60;
PIECE_SIZE = SQUARE_SIZE - 5;
PIECE_OFFSET = (SQUARE_SIZE - PIECE_SIZE) / 2;
BOARD_SIZE = 8 * SQUARE_SIZE;

function placePiece(board, name, place, bottom_color) {
    var i, j;
    i = place.charCodeAt(0) - 'A'.charCodeAt(0);
    j = 7 - (place.charCodeAt(1) - '1'.charCodeAt(0));
    if (bottom_color == 'black') {
        // flip board if necessary
        i = 7 - i; j = 7 - j;
    }
    return board.image('/images/pieces/' + name + '.svg', SQUARE_SIZE * i + PIECE_OFFSET, SQUARE_SIZE * j + PIECE_OFFSET, PIECE_SIZE, PIECE_SIZE);
}

function getPieceAt(board, i, j) {
    // Get the center of the appropriate square
    var x = i * SQUARE_SIZE + PIECE_OFFSET;
    var y = j * SQUARE_SIZE + PIECE_OFFSET;
    var elements = board.getElementsByPoint(x, y);

    for (i in elements) {
        if (elements[i].type == "image")
            return elements[i];
    }

    return null;
}

function movePiece(board, oi, oj, i, j) {
    var piece = getPieceAt(board, oi, oj);
    piece.attr("x", i * SQUARE_SIZE + PIECE_OFFSET);
    piece.attr("y", j * SQUARE_SIZE + PIECE_OFFSET);
}

// piece drag actions
var start = function(event) {
    this.ox = this.attr("x");
    this.oy = this.attr("y");
    this.animate({r: 70, opacity: 1}, 500, ">");
},
move = function(dx, dy) {
    var nowX, nowY;
    nowX = Math.max(0, this.ox + dx);
    nowY = Math.max(0, this.oy + dy);
    nowX = Math.min(BOARD_SIZE - PIECE_SIZE, nowX);
    nowY = Math.min(BOARD_SIZE - PIECE_SIZE, nowY); 
    this.attr({x: nowX, y: nowY});
},
up = function(event) {
    this.animate({r: 50, opacity: 1}, 500, ">");

    // get square center of piece is in
    var i = Math.floor(event.layerX / SQUARE_SIZE),
        j = Math.floor(event.layerY / SQUARE_SIZE);

    if(0 <= i && i < 8 && 0 <= j && j < 8) {
        // if valid square, snap piece to center of square
        this.attr("x", SQUARE_SIZE * i + PIECE_OFFSET);
        this.attr("y", SQUARE_SIZE * j + PIECE_OFFSET);

        // Get the original position
        var oi = Math.floor(this.ox / SQUARE_SIZE);
        var oj = Math.floor(this.oy / SQUARE_SIZE);
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
            board_squares[i][j] = board.rect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE).attr({'stroke-width': 0, 'fill': fill_color});
        }
    }

    for (var place in starting_places) {
        var piece = placePiece(board, starting_places[place], place, bottom_color);
        piece.drag(move, start, up);
    }
}

GameView = Backbone.View.extend({
    el: "#content",
    gameId: null,
    initialize: function() {
	console.log(this.options.gameId);
    },
    render: function() {
	var template = _.template($("#template_game").html(), {});

	this.$el.html(template);

	this.boards = {};
	this.bottom_color = {};
	this.boards[0] = Raphael("board1_container", BOARD_SIZE, BOARD_SIZE);
    	this.boards[1] = Raphael("board2_container", BOARD_SIZE, BOARD_SIZE);

    	setupBoard(this.boards[0], 'white');
    	setupBoard(this.boards[1], 'black');
	return this;
    },
    remove: function() {

    }
});

AppRouter = Backbone.Router.extend({
    initialize: function(el) {
	this.el = el;
	this.lobbyView = new LobbyView();
    },
    currentView: null,

    switchView: function(view) {
	this.el.html(view.$el.html());
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
    var router = new AppRouter($('#content'));

    Backbone.history.start();
});

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