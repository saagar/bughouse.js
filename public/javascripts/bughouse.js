$(document).ready(function() {
	console.log("Bughouse starting up.");

	// intialize board
	var square_size = 75;
	var paper = Raphael("board_container", square_size * 8, square_size * 8);
	var circle = paper.circle(50, 40, 10);

	

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

	paper.image('/images/pieces/white rook.svg', 0, square_size * 7, 60, 60);
	paper.image('/images/pieces/white rook.svg', square_size * 7, square_size * 7, 60, 60);
});