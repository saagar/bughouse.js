function bughouse()
{
    // private variables
    var board0;
    var board1;
    var reserve0w; //first board, white player's reserve pieces
    var reserve0b; //first board, black player's reserve pieces
    var reserve1w; //second board, white player's reserve pieces
    var reserve1b; //second board, black player's reserve pieces
    //use reserve0w.push("nameofpiece") to add to array

  // private constructor 
  __construct = function() 
  {
    console.log("new bughouse game created.");
    //set board0 and board1 to default start
    board0 = {
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
      "A3": "nobody",
      "B3": "nobody",
      "C3": "nobody",
      "D3": "nobody",
      "E3": "nobody",
      "F3": "nobody",
      "G3": "nobody",
      "H3": "nobody",
      "A4": "nobody",
      "B4": "nobody",
      "C4": "nobody",
      "D4": "nobody",
      "E4": "nobody",
      "F4": "nobody",
      "G4": "nobody",
      "H4": "nobody",
      "A5": "nobody",
      "B5": "nobody",
      "C5": "nobody",
      "D5": "nobody",
      "E5": "nobody",
      "F5": "nobody",
      "G5": "nobody",
      "H5": "nobody",
      "A6": "nobody",
      "B6": "nobody",
      "C6": "nobody",
      "D6": "nobody",
      "E6": "nobody",
      "F6": "nobody",
      "G6": "nobody",
      "H6": "nobody",   
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

    board1 = {
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
      "A3": "nobody",
      "B3": "nobody",
      "C3": "nobody",
      "D3": "nobody",
      "E3": "nobody",
      "F3": "nobody",
      "G3": "nobody",
      "H3": "nobody",
      "A4": "nobody",
      "B4": "nobody",
      "C4": "nobody",
      "D4": "nobody",
      "E4": "nobody",
      "F4": "nobody",
      "G4": "nobody",
      "H4": "nobody",
      "A5": "nobody",
      "B5": "nobody",
      "C5": "nobody",
      "D5": "nobody",
      "E5": "nobody",
      "F5": "nobody",
      "G5": "nobody",
      "H5": "nobody",
      "A6": "nobody",
      "B6": "nobody",
      "C6": "nobody",
      "D6": "nobody",
      "E6": "nobody",
      "F6": "nobody",
      "G6": "nobody",
      "H6": "nobody",   
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

    reserve0w = [];
    reserve0b = [];
    reserve1w = [];
    reserve1b = [];
  }()

  // get JSON
  this.getJSON = function()
  {
    return { "0": board0, "1": board1, "reserve0w": reserve0w, "reserve0b": reserve0b, "reserve1w": reserve1w, "reserve1b": reserve1b };
  }

  // checks validity of move
  this.move = function(data)
  {
    return;
  }
}

var b = new bughouse();
console.log(b.getJSON());