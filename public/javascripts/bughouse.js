SQUARE_SIZE = 60;
PIECE_SIZE = SQUARE_SIZE - 5;
PIECE_OFFSET = (SQUARE_SIZE - PIECE_SIZE) / 2;
BOARD_SIZE = 8 * SQUARE_SIZE;

$(document).ready(function() {
    console.log("Bughouse starting up.");

    // intialize board
    var boards = {},
        bottom_color = {};
    // board 0 - user board, board 1 - other board
    boards[0] = Raphael("board1_container", BOARD_SIZE, BOARD_SIZE);
    boards[1] = Raphael("board2_container", BOARD_SIZE, BOARD_SIZE);
    bottom_color[0] = 'white', bottom_color[1] = 'black';

    var placePiece = function(board, name, place) {
        var i, j;
        i = place.charCodeAt(0) - 'A'.charCodeAt(0);
        j = 7 - (place.charCodeAt(1) - '1'.charCodeAt(0));
        if (bottom_color[board] == 'black') {
            // flip board if necessary
            i = 7 - i; j = 7 - j;
        }
        return boards[board].image('/images/pieces/' + name + '.svg', SQUARE_SIZE * i + PIECE_OFFSET, SQUARE_SIZE * j + PIECE_OFFSET, PIECE_SIZE, PIECE_SIZE);
    }

    // piece drag actions
    var start = function(event) {
        this.ox = this.attr("x");
        this.oy = this.attr("y");
        this.animate({r: 70, opacity: 1}, 500, ">");
    },
    move = function(dx, dy) {
        this.attr({x: this.ox + dx, y: this.oy + dy});
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
        } else {
            // otherwise return to original position
            this.attr("x", this.ox);
            this.attr("y", this.oy);
        }
    };

    var setupBoard = function(board) {
        // intialize board rectangles
        var board_squares = {};
        var i, j;
        for (i = 0; i < 8; i++) {
            board_squares[i] = {};
            for (j = 0; j < 8; j++) {
                var fill_color = ((i + j) % 2 == 0) ? "#f0d9b5" : "#b58863"; // light brown : dark brown
                board_squares[i][j] = boards[board].rect(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE).attr({'stroke-width': 0, 'fill': fill_color});
            }
        }

        for (var place in starting_places) {
            var piece = placePiece(board, starting_places[place], place);
            piece.drag(move, start, up);
        }
    }

    setupBoard(0);
    setupBoard(1);

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