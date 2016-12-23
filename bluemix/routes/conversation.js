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
      var data = null;
      var message = null;

      /*                
      // Physical control (IoT)
      // Build message to publish
      if( body.intents[0].intent == 'turn_on' ) {
        // Turn the light on
        message = {
          light: 1    
        };
      } else if( body.intents[0].intent == 'turn_off' ) {
        // Turn the light off
        message = {
          light: 0    
        };
      }

      // IoT oriented intent
      if( message != null ) {
        if( req.config.iot.enabled ) {
          // Send device command
          req.iot.publish( 
            IOT_TOPIC, 
            JSON.stringify( message ) 
          );                            
        }
      }
      */

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
