var express = require( 'express' );
var request = require( 'request' );

// Router
var router = express.Router();

// Discover intent
router.post( '/language', function( req, res ) {
  request( {
    method: 'POST',
    url: req.config.alchemy.url,  
      form: {
        apikey: req.config.alchemy.api_key,
        outputMode: 'json',
        url: 'https://www.twitter.com/' + req.body.handle,
        extract: 'doc-emotion,doc-sentiment'
      }
  }, function( err, result, body ) {
    // Client gets unparsed body content
    res.send( body );
  } );
} );

// Test
router.get( '/language/test', function( req, res ) {
  res.json( {watson: 'Language'} );
} );
    
// Export
module.exports = router;
