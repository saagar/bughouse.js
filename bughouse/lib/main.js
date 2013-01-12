var algebraic = require('./algebraicGameClient.js'),
    bughouse = require('./bughouseGameClient.js'),
	simple = require('./simpleGameClient.js');

// exports
module.exports = {
	create : function () {
		'use strict';

		//return algebraic.create();
    return bughouse.create();
	},
	createSimple : function () {
		'use strict';

		return simple.create();
	}
};
