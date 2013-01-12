var algGC = require('./algebraicGameClient.js')

var BughouseGameClient = function (g1,g2) {
  'use strict';

  // g1,g2 is a game (made with game.create())
  var game1 = new AlgebraicGameClient(g1);
  var game2 = new AlgebraicGameClient(g2);

  var games = {"game1":game1, "game2":game2};

  return games;

};

// wrapper to Algebraic updateGameClient
var bugUpdateGameClient = function (gc) {
  updateGameClient(gc['game1']);
  updateGameClient(gc['game2']);
};


// exports
module.exports = {
  create : function () {
    'use strict';
    
    var g1 = game.create(),
        g2 = game.create(),
        gc = new BughouseGameClient(g1,g2);

    bugUpdateGameClient(gc);
    return gc;
  }
};
