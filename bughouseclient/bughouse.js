function bughouse()
{
    // private variables
    var boards;
    var boardturns; //0 if it's white's turn, 1 for black (index is the board)
    var reserve0w; //first board, white player's reserve pieces
    var reserve0b; //first board, black player's reserve pieces
    var reserve1w; //second board, white player's reserve pieces
    var reserve1b; //second board, black player's reserve pieces
    //use reserve0w.push("nameofpiece") to add to array

    var knightMoves = {
      "1": [2,1],
      "2": [2,-1],
      "3": [1,-2],
      "4": [-1,-2],
      "5": [-2,-1],
      "6": [-2,1],
      "7": [-1,2],
      "8": [1,2]
    };

  // private constructor 
  __construct = function() 
  {
    console.log("new bughouse game created.");
    //set board0 and board1 to default start
    var board0 = {
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

    var board1 = {
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

    boards = [board0, board1];
    boardturns = [0,0]; //sets it to white's turn on both boards
    reserve0w = [];
    reserve0b = [];
    reserve1w = [];
    reserve1b = [];
  }()

  // get JSON
  this.getJSON = function()
  {
    return { "0": boards[0], 
            "1": boards[1], 
            "boardturns": boardturns,
            "reserve0w": reserve0w, 
            "reserve0b": reserve0b, 
            "reserve1w": reserve1w, 
            "reserve1b": reserve1b };
  }

  // checks validity of move
  this.move = function(data)
  {
    return;
  }

  // checks if current position of board 'boardnum' is in check
  this.isInCheck = function(boardnum)
  {
    // gets all squares that the OPPONENT's pieces are attacking
    if(!boardturns[boardnum]){
      console.log("white's turn");
      getAttackedSpaces(0);
      //check if king is in any of the attacked spaces
      return false;
    }
    else{
      console.log("black's turn");
      getAttackedSpaces(1);
      //check if king is in any of the attacked spaces
      return false;
    }
  }

  this.getAttackedSpaces = function(boardnum)
  {
    for (e in boards[boardnum])
    {
      //alert(e); //e is going to be the key, that is, for example, "A1"

    }


  }

  // converts a space name like "A1" into a tuple like (1,1)
  this.convertToTuple = function(space)
  {
    switch(space.charAt(0))
    {
      case "A":
        return [1, parseInt(space.charAt(1))];
      case "B":
        return [2, parseInt(space.charAt(1))];
      case "C":
        return [3, parseInt(space.charAt(1))];
      case "D":
        return [4, parseInt(space.charAt(1))];
      case "E":
        return [5, parseInt(space.charAt(1))];
      case "F":
        return [6, parseInt(space.charAt(1))];
      case "G":
        return [7, parseInt(space.charAt(1))];
      case "H":
        return [8, parseInt(space.charAt(1))];
    } 
  }


  // returns array of [pieceowner, piecetype]
  // pieceowner: 0 for white, 1 for black, -1 for empty
  // piecetype: name of piece, or "nobody".

  // space should be a string such as "A1" and 
  // boardnum should be an int such as 0
  this.getPieceData = function(boardnum, space)
  {
    var temp = boards[boardnum][space].split(" ");

    if (temp[0] === "white") //piece is white
    {
      return [0, temp[1]];
    }
    else if (temp[0] === "black") //piece is black
    {
      return [1, temp[1]];
    }
    else //no piece there
    {
      return [1, "nobody"];
    }
  }
}

var b = new bughouse();
console.log(b.getJSON());