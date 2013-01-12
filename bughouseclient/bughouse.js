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
  // data: "0b_f2-g4"
  this.move = function(data)
  {
    //first check if the current situation before moving is check
    //if so, then check if next move is also check
    // if so, then not legal.
    // if not, then check if move is legal
    // if so, then ok
    //if not, then its wrong

    //if current situation is not check, check if move is legal
    //if so, make sure second position is not check
    //if not check then legal


    return;
  }

  // checks if current position of board 'boardnum' is in check
  this.isInCheck = function(boardnum)
  {
    // gets all squares that the OPPONENT's pieces are attacking
    if(!boardturns[boardnum]){
      //console.log("white's turn");
      getAttackedSpaces(boardnum, 1); //gets spaces being attacked by black
      //check if king is in any of the attacked spaces
      return false;
    }
    else{
      //console.log("black's turn");
      getAttackedSpaces(boardnum, 0); //get spaces being attacked by white
      //check if king is in any of the attacked spaces
      return false;
    }
  }

  // returns list of all spaces being attacked legally by the specified 
  // player on the specified board
  this.getAttackedSpaces = function(boardnum, player)
  {
    attackedSpaces = [];

    for (e in boards[boardnum])
    {
      var tempPiece = getPieceData(boardnum, e)
      if (tempPiece[0] == player)
      { //boardnumber, type of piece, piece's location, player owning the piece
        attackedSpaces = _union(attackedSpaces, getSinglePieceAttackSquares(boardnum, tempPiece[1], e))
      }
    }
    return attackedSpaces;
  }

  // example: 0, "knight", "A1", 1
  this.getSinglePieceAttackSquares(boardnum, piece, location, player)
  {
    switch(piece)
    {
      case "knight":
        return checkKnightMoves(boardnum, piece, location, player);
      case "pawn":
        return checkPawnMoves(boardnum, piece, location, player);
      case "king":
        return checkKingMoves(boardnum, piece, location, player);
      case "queen":
        // this case can use bishop and rook checks
        var mvs = checkDiagonalMoves(boardnum, piece, location, player);
        mvs.push(checkHVMoves(boardnum, piece, location, player));
        return mvs;
      case "bishop":
        return checkDiagonalMoves(boardnum, piece, location, player);
      case "rook":
        return checkHVMoves(boardnum, piece, location, player);

    }

  }

  this.

  // converts a space name like "A1" into a tuple like [1,1]
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
  // piecetype: name of piece, or "".

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
      return [-1, ""];
    }
  }
}

var b = new bughouse();
console.log(b.getJSON());
