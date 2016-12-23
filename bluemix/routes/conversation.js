var express = require( 'express' );
var mqtt = require( 'mqtt' );
var request = require( 'request' );

// var IOT_TOPIC = 'iot-2/type/Photon/id/HDC2016/cmd/light/fmt/json';

// Router
var router = express.Router();

// Discover intent
router.post( '/conversation/intent', function( req, res ) {
  var hash = null;
  var url = null;
    
  // API endpoint
  // Based on workspace ID
  url =
    req.config.conversation.url +
    req.config.conversation.workspace_path + 
    req.config.conversation.workspace_id +
    req.config.conversation.message + 
    req.config.conversation.version;
    
  // Authentication
  // HTTP Basic
  hash = new Buffer( 
    req.config.conversation.username + 
    ':' + 
    req.config.conversation.password
  ).toString( 'base64' );
    
  request( {
    method: 'POST',
    url: url,   
    headers: {
      'Authorization': 'Basic ' + hash
    },
    json: true,
    body: {
      input: {
        text: req.body.text
      }
    }
  }, function( err, result, body ) {
    // Client gets unparsed body content
    res.send( body );
  } );
} );

// Test
router.get( '/conversation/test', function( req, res ) {
  res.json( {watson: 'Conversation'} );
} );
    
// Export
module.exports = router;
