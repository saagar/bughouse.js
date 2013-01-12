var _ = require('underscore');

exports.bughouse = function()
{
    // private variables
    var boards;
    var boardturns; //0 if it's white's turn, 1 for black (index is the board)
    var reserve; //first board, white player's reserve pieces
    //use reserve['0w'].push("nameofpiece") to add to array

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
      "E2": "",
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
      "C4": "black queen",
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
    reserve = {
      "0":
      {
        "white pawn": 0,
        "white knight": 0,
        "white bishop": 0,
        "white rook": 0,
        "white queen": 0,
        "black pawn": 0,
        "black knight": 0,
        "black bishop": 0,
        "black rook": 0,
        "black queen": 0
      },
      "1":
      {
        "white pawn": 0,
        "white knight": 0,
        "white bishop": 0,
        "white rook": 0,
        "white queen": 0,
        "black pawn": 0,
        "black knight": 0,
        "black bishop": 0,
        "black rook": 0,
        "black queen": 0       
      }
    };
  }()

  // get JSON
  this.getJSON = function()
  {
    return { "0": boards[0], 
            "1": boards[1], 
            "boardturns": boardturns,
            "reserve": reserve,
          }
  }

  this.copyBoard = function(board) {
    var newBoard = {};
    for (e in board) {
      newBoard[e] = board[e];
    }
    return newBoard;
  }

  // checks validity of move 
  // data: "0b_F2-G4"
  // data: "0w:queen_b4"
  this.move = function(data)
  {
    var legal = false;
    // get the board
    var moveBoardNum = parseInt(data.charAt(0));
    // get the color on the board
    var moveColor = data.charAt(1) == 'w' ? 0 : 1;
    console.log(data.charAt(2));
    if (data.charAt(2) === ':') {
      var toLoc = data.split('_')[1];
      piece = data.split(':')[1].split('_')[0];
      boardPiece = this.getPieceData(moveBoardNum, toLoc);
      if (boardPiece[1] == "") {
        boards[moveBoardNum][toLoc] = (moveColor == 0 ? 'white ' : 'black ') + piece;
        legal = true;
        boardturns[moveBoardNum] = 1-boardturns[moveBoardNum];
      }
    } else {
      var boardPlayerTuple = data.substring(0, 2);
      var fromLoc = data.substring(3, 5);
      var toLoc = data.substring(6);
      var piece = this.getPieceData(moveBoardNum, fromLoc)[1];
      console.log(boardPlayerTuple + " " + fromLoc + " " + toLoc + " " + piece);
      // There is no piece
      if (piece != "") {
        //first check if the current situation before moving is check

        if (_.contains(this.getSinglePieceAttackSquares(moveBoardNum, piece, fromLoc, moveColor), toLoc)) {
          var moveBoard = this.copyBoard(boards[moveBoardNum]);
          // We are capturing
          if (moveBoard[toLoc] != "") {
            var capturedPiece = this.getPieceData(moveBoardNum, toLoc);
            reserve[boardPlayerTuple.charAt(0)][((capturedPiece[0]) ? "white " : "black ") + capturedPiece[1]] += 1;
          }
          moveBoard[toLoc] = moveBoard[fromLoc];
          moveBoard[fromLoc] = "";
          if (!this.isInCheckBoard(moveBoard, moveBoardNum)) {
            legal = true;
            // change it on the actual board
            boards[moveBoardNum] = moveBoard;
            boardturns[moveBoardNum] = 1-boardturns[moveBoardNum];
          }
        }
      }
    }
    var json = this.getJSON();
    json['wasLegal'] = legal;
    return json;
  }

  // checks if current position of board 'boardnum' is in check
  this.isInCheck = function(boardnum)
  {
    // gets all squares that the OPPONENT's pieces are attacking
    if(!boardturns[boardnum]) {
      //console.log("white's turn");
      this.getAttackedSpaces(boardnum, 1); //gets spaces being attacked by black
      //check if king is in any of the attacked spaces
      return false;
    } else {
      //console.log("black's turn");
      this.getAttackedSpaces(boardnum, 0); //get spaces being attacked by white
      //check if king is in any of the attacked spaces
      return false;
    }
    return true;
  }

  this.isInCheckBoard = function(board, boardnum)
  {
    // gets all squares that the OPPONENT's pieces are attacking
    if(boardturns[boardnum] == 0) {
      //console.log("white's turn");
      var spaces = this.getBoardAttackedSpaces(board, 1, boardnum); //gets spaces being attacked by black
      console.log(spaces);
      //check if king is in any of the attacked spaces
      for (e in board) {
        if (this.getBoardPieceData(board, e)[1] === "king" && this.getBoardPieceData(board, e)[0] == 0) {
          console.log(e);
          if(_.contains(spaces, e)) {
            return true;
          }
        }
      }
    } else {
      //console.log("black's turn");
      this.getBoardAttackedSpaces(board, 0, boardnum); //get spaces being attacked by white
      //check if king is in any of the attacked spaces
      for (e in boards[boardnum]) {
        if (this.getPieceData(boardnum, e)[1] === "king" && this.getPieceData(boardnum, e)[0] == 1) {
          if(_.contains(spaces, e)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  this.getBoardAttackedSpaces = function(board, player, boardnum)
  {
    attackedSpaces = [];

    for (e in board)
    {
      var tempPiece = this.getPieceData(boardnum, e)
      if (tempPiece[0] == player)
      { //boardnumber, type of piece, piece's location, player owning the piece
        attackedSpaces = _.union(attackedSpaces, this.getSinglePieceAttackSquares(boardnum, tempPiece[1], e))
      }
    }
    return attackedSpaces;
  }

  // returns list of all spaces being attacked legally by the specified 
  // player on the specified board
  this.getAttackedSpaces = function(boardnum, player)
  {
    attackedSpaces = [];

    for (e in boards[boardnum])
    {
      var tempPiece = this.getPieceData(boardnum, e)
      if (tempPiece[0] == player)
      { //boardnumber, type of piece, piece's location, player owning the piece
        attackedSpaces = _.union(attackedSpaces, this.getSinglePieceAttackSquares(boardnum, tempPiece[1], e))
      }
    }
    return attackedSpaces;
  }

  // example: 0, "knight", "A1", 1
  this.getSinglePieceAttackSquares = function(boardnum, piece, location, player)
  {
    switch(piece)
    {
      case "knight":
        return this.checkKnightMoves(boardnum, location, player);
      case "pawn":
        return this.checkPawnMoves(boardnum, location, player);
      case "king":
        return this.checkKingMoves(boardnum, location, player);
      case "queen":
        // this case can use bishop and rook checks
        var mvs = this.checkDiagonalMoves(boardnum, location, player);
        mvs = mvs.concat(this.checkHVMoves(boardnum, location, player));
        return mvs;
      case "bishop":
        return this.checkDiagonalMoves(boardnum, location, player);
      case "rook":
        return this.checkHVMoves(boardnum, location, player);
    }
  }

  this.checkKnightMoves = function(boardnum, location, player){
    var mvs = [];
    var tuple = this.convertToTuple(location);

    for (e in knightMoves)
    {
      var newTuple = [tuple[0] + knightMoves[e][0], tuple[1] + knightMoves[e][1]];
      if (newTuple[0] > 0 && newTuple[0] <= 8 && newTuple[1] > 0 && newTuple[1] <= 8)
      { // space is on board
        var newString = this.convertToString(newTuple);
        var temp1 = this.getPieceData(boardnum, newString);
        if (temp1[1] === "") // if empty, then it's valid
        {
          mvs.push(newString);
        }
        else if (temp1[0] != player){ //if piece not player, capture
          mvs.push(newString);
        }
      }
    }

    return mvs;
  }

  this.checkPawnMoves = function(boardnum, location, player){
    var mvs = [];
    var tuple = this.convertToTuple(location);

    var piece_data = this.getPieceData(boardnum, location);

    if (piece_data[0] == 0)
    { // white pawn
      if (tuple[1] + 1 <= 8){
        var temp = this.convertToString([tuple[0], tuple[1] + 1]);
        if (this.getPieceData(boardnum, temp)[0] == -1)
        {
          mvs.push(temp);
        }
      }
      if (tuple[1] == 2)
      { //also at starting position
        var temp2 = this.convertToString([tuple[0], tuple[1] + 2]);
        if (this.getPieceData(boardnum, temp2)[0] == -1)
        {
          mvs.push(temp2);
        }
      }

      var diagleft;
      var diagright;

      if (tuple[0]-1 > 0 && tuple[1]+1 <= 8)
      { //diag up left is in board
        diagleft = this.convertToString([tuple[0]-1, tuple[1]+1]);
        if (this.getPieceData(boardnum, diagleft)[0] == 1){
          //opponent piece is there
          mvs.push(diagleft);
        }
      }

      if (tuple[0]+1 <= 8 && tuple[1]+1 <= 8)
      { //diag up right is in board
        diagright = this.convertToString([tuple[0]+1, tuple[1]+1]);
        if (this.getPieceData(boardnum, diagright)[0] == 1){
          //opponent piece is there
          mvs.push(diagright);
        }
      }
    }

    else if (piece_data[0] == 1)
    { // black player
      if (tuple[1] - 1 > 0){
        var temp3 = this.convertToString([tuple[0], tuple[1] - 1]);
        if (this.getPieceData(boardnum, temp3)[0] == -1)
        {
          mvs.push(temp3);
        }
      }

      if (tuple[1] == 7)
      { //also at starting position
        var temp4 = this.convertToString([tuple[0], tuple[1] - 2]);
        if (this.getPieceData(boardnum, temp4)[0] == -1)
        {
          mvs.push(temp4);
        }
      }
      console.log('black paw');
      var diagleftB;
      var diagrightB;
      if (tuple[0]-1 > 0 && tuple[1]-1 > 0)
      { //if going down and left is still in board
        diagleftB = this.convertToString([tuple[0]-1, tuple[1]-1]);
        if (this.getPieceData(boardnum, diagleftB)[0] == 0){
          mvs.push(diagleftB);
        }
      }

      if (tuple[0]+1 <= 8 && tuple[1]-1 > 0)
      { //if going down and right is still in board
        diagrightB = this.convertToString([tuple[0]+1, tuple[1]-1]);
        if (this.getPieceData(boardnum, diagrightB)[0] == 0){
          mvs.push(diagrightB);
        }
      }
    }
    return mvs;
  }

  this.checkKingMoves = function(boardnum, location, player){
    var mvs = [];
    var sqs = [];
    var tuple = this.convertToTuple(location);

    // get top 3
    if ((tuple[1]+1 <= 8)){
      sqs.push(this.convertToString([tuple[0],tuple[1]+1]));
      if (tuple[0]+1 <= 8)
        sqs.push(this.convertToString([tuple[0]+1,tuple[1]+1]));
      if (tuple[0]-1 > 0)
        sqs.push(this.convertToString([tuple[0]-1,tuple[1]+1]));
    }

    // get bottom 3
    if (tuple[1]-1 > 0){
      sqs.push(this.convertToString([tuple[0],tuple[1]-1])); 
      if (tuple[0]+1 <= 8)
        sqs.push(this.convertToString([tuple[0]+1,tuple[1]-1]));
      if (tuple[0]-1 > 0)
        sqs.push(this.convertToString([tuple[0]-1,tuple[1]-1]));
    }

    // get left
    if (tuple[0]-1 > 0)
      sqs.push(this.convertToString([tuple[0]-1,tuple[1]])); 
    
    // get right
    if (tuple[0]+1 <= 8)
      sqs.push(this.convertToString([tuple[0]+1,tuple[1]])); 

    //console.log(sqs);
    var len = sqs.length;
    for (var i = 0; i < len; i++){
      console.log(sqs[i]);
      var pieceAtSquare = this.getPieceData(boardnum, sqs[i]);
      // if no piece or piece is other color, valid move
      if ((pieceAtSquare[1] == "") || (pieceAtSquare[0] != player)){
        mvs.push(sqs[i]);
      }
    }
    return mvs;
  }

  this.checkDiagonalMoves = function(boardnum, location, player){
    var mvs = [];
    var tuple = this.convertToTuple(location);

    var j = tuple[1];
    // check lower right diagonal
    for(var i = tuple[0]+1; i <= 8; i++){
      j--;
      // check if valid square
      if ((i < 1) || (i > 8) || (j < 1) || (j > 8)){
        break;
      }
      else {
        var square = this.convertToString([i,j]);
        var pieceAtSquare = this.getPieceData(boardnum, square);
        // if no piece, valid move
        if(pieceAtSquare[1] == ""){
          mvs.push(square);
        }
        // if piece is not player piece, valid move (capture), and exit loop
        else if(pieceAtSquare[0] != player){
          mvs.push(square);
          break;
        }
        // if piece is player piece, invalid move, exit loop
        else{
          break;
        }
      }
    }

    j = tuple[1];
    // check upper right diagonal
    for(var i = tuple[0]+1; i <= 8; i++){
      j++;
      // check if valid square
      if ((i < 1) || (i > 8) || (j < 1) || (j > 8)){
        break;
      }
      else {
        var square = this.convertToString([i,j]);
        var pieceAtSquare = this.getPieceData(boardnum, square);
        // if no piece, valid move
        if(pieceAtSquare[1] == ""){
          mvs.push(square);
        }
        // if piece is not player piece, valid move (capture), and exit loop
        else if(pieceAtSquare[0] != player){
          mvs.push(square);
          break;
        }
        // if piece is player piece, invalid move, exit loop
        else{
          break;
        }
      }
    }

    j = tuple[1];
    // check lower left diagonal
    for(var i = tuple[0]-1; i >= 0; i--){
      j--;
      // check if valid square
      if ((i < 1) || (i > 8) || (j < 1) || (j > 8)){
        break;
      }
      else {
        var square = this.convertToString([i,j]);
        var pieceAtSquare = this.getPieceData(boardnum, square);
        // if no piece, valid move
        if(pieceAtSquare[1] == ""){
          mvs.push(square);
        }
        // if piece is not player piece, valid move (capture), and exit loop
        else if(pieceAtSquare[0] != player){
          mvs.push(square);
          break;
        }
        // if piece is player piece, invalid move, exit loop
        else{
          break;
        }
      }
    }
    
    j = tuple[1];
    // check upper left diagonal
    for(var i = tuple[0]-1; i >= 0; i--){
      j++;
      // check if valid square
      if ((i < 1) || (i > 8) || (j < 1) || (j > 8)){
        break;
      }
      else {
        var square = this.convertToString([i,j]);
        var pieceAtSquare = this.getPieceData(boardnum, square);
        // if no piece, valid move
        if(pieceAtSquare[1] == ""){
          mvs.push(square);
        }
        // if piece is not player piece, valid move (capture), and exit loop
        else if(pieceAtSquare[0] != player){
          mvs.push(square);
          break;
        }
        // if piece is player piece, invalid move, exit loop
        else{
          break;
        }
      }
    }

    return mvs;
  }

  this.checkHVMoves = function(boardnum, location, player){
    var mvs = [];
    var tuple = this.convertToTuple(location);

    // check vertical mvs
      
    // go UP first
    for(var i = tuple[1]+1; i <= 8; i++){
      var square = this.convertToString([tuple[0],i]);
      var pieceAtSquare = this.getPieceData(boardnum, square);
      
      // if no piece, valid move
      if(pieceAtSquare[1] == ""){
        mvs.push(square);
      }
      // if piece is not player piece, valid move (capture), and exit loop
      else if(pieceAtSquare[0] != player){
        mvs.push(square);
        break;
      }
      // if piece is player piece, invalid move, exit loop
      else{
        break;
      }
    }
    // go DOWN after
    for(var i = tuple[1]-1; i > 0; i--){
      var square = this.convertToString([tuple[0],i]);
      var pieceAtSquare = this.getPieceData(boardnum, square);
      // if no piece, valid move
      if(pieceAtSquare[1] == ""){
        mvs.push(square);
      }
      // if piece is not player piece, valid move (capture), and exit loop
      else if(pieceAtSquare[0] != player){
        mvs.push(square);
        break;
      }
      // if piece is player piece, invalid move, exit loop
      else{
        break;
      }
    }

    // check horizontal mvs

    // go RIGHT first
    for(var i = tuple[0]+1; i <= 8; i++){

      var square = this.convertToString([i,tuple[1]]);
      var pieceAtSquare = this.getPieceData(boardnum, square);
      
      // if no piece, valid move
      if(pieceAtSquare[1] == ""){
        mvs.push(square);
      }
      // if piece is not player piece, valid move (capture), and exit loop
      else if(pieceAtSquare[0] != player){
        mvs.push(square);
        break;
      }
      // if piece is player piece, invalid move, exit loop
      else{
        break;
      }
    }
    
    // go LEFT after
    for(var i = tuple[0]-1; i > 0; i--){
      
      var square = this.convertToString([i,tuple[1]]);
      var pieceAtSquare = this.getPieceData(boardnum, square);
      
      // if no piece, valid move
      if(pieceAtSquare[1] == ""){
        mvs.push(square);
      }
      // if piece is not player piece, valid move (capture), and exit loop
      else if(pieceAtSquare[0] != player){
        mvs.push(square);
        break;
      }
      // if piece is player piece, invalid move, exit loop
      else{
        break;
      }
    }

    return mvs;
  }

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

  // converts a two element array into square name:
  // for example, converts "[3, 1]" into "C1"
  this.convertToString = function(tuple)
  {
    var row = tuple[1];
    switch(tuple[0])
    {
      case 1:
        return "A" + row.toString();
      case 2:
        return "B" + row.toString();
      case 3:
        return "C" + row.toString();
      case 4:
        return "D" + row.toString();
      case 5:
        return "E" + row.toString();
      case 6:
        return "F" + row.toString();
      case 7:
        return "G" + row.toString();
      case 8:
        return "H" + row.toString();
    }
  }

  // returns array of [pieceowner, piecetype]
  // pieceowner: 0 for white, 1 for black, -1 for empty
  // piecetype: name of piece, or "".

  // space should be a string such as "A1" and 
  // boardnum should be an int such as 0
  this.getPieceData = function(boardnum, space)
  {
//    console.log(boardnum);
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

  this.getBoardPieceData = function(board, space)
  {
//    console.log(boardnum);
    var temp = board[space].split(" ");

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

  return this;
}

var b = new exports.bughouse();
console.log(b.move("0w_D1-E2"));
//console.log(b.getSinglePieceAttackSquares(0, "rook","F4", 0));
//console.log(b.getSinglePieceAttackSquares(0,"rook", "F4", 0));
//console.log(b.getSinglePieceAttackSquares(0, "bishop","G4", 0));
//console.log(b.getSinglePieceAttackSquares(0, "knight","E4", 0));
//console.log(b.getSinglePieceAttackSquares(0, "queen","D4", 0));
//console.log(b.getSinglePieceAttackSquares(0, "king","H4", 0));
