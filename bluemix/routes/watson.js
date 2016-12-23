var express = require( 'express' );
var request = require( 'request' );

// Router
var router = express.Router();

// Test
router.get( '/test', function( req, res ) {
	res.json( {jfokus: 'Watson'} );
} );
	
// Export
module.exports = router;
