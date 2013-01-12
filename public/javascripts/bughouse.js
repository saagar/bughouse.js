$(document).ready(function() {
	console.log("Bughouse starting up.");

	// intialize board
	var square_size = 75;
	var piece_size = 60;
	var piece_offset = (square_size - piece_size) / 2.0;
	var board_size = square_size * 8;
	var paper = Raphael("board_container", square_size * 8, square_size * 8);
	var circle = paper.circle(50, 40, 10);
	
	var bottom_color = 'white';

	var place_piece = function(name, place) {
		var i, j;
		i = place.charCodeAt(0) - 65;
		j = place.charCodeAt(1) - 49;
		if(bottom_color == 'white') j = 7 - j;
		return paper.image('/images/pieces/' + name + '.svg', square_size * i + piece_offset, square_size * j + piece_offset, piece_size, piece_size);
	}

	var board_squares = {};
	var i, j;
	for( i = 0 ; i < 8 ; i++ ) {
		board_squares[i] = {};
		for ( j = 0 ; j < 8 ; j++ ) {
			// light brown and dark brown
			var fill_color = ((i + j) % 2 == 0) ? "#f0d9b5" : "#b58863";
			board_squares[i][j] = paper.rect(i * square_size, j * square_size, square_size, square_size).attr({'stroke-width': 0, 'fill': fill_color});
		}
	}
	// setup pawns 
	for( i = 0 ; i < 8 ; i++ ) {
		paper.image('/images/pieces/white pawn.svg', i * square_size, square_size * 6, 60, 60);
		paper.image('/images/pieces/black pawn.svg', i * square_size, square_size, 60, 60);
	}

	// piece starting locations
	var starting_places = {};

	var start = function () {    
	  this.ox = this.attr("x");         
	  this.oy = this.attr("y");         
	  this.animate({r: 70, opacity: .5}, 500, ">");     
	},
	move = function (dx, dy) {
	  this.attr({x: this.ox + dx, y: this.oy + dy});     
	},
	up = function () {
	  this.animate({r: 50, opacity: 1}, 500, ">");
	};


	var rook = place_piece('white rook', 'A1');
	rook.drag(move, start, up);
	place_piece('white rook', 'H1');
});