var express = require( 'express' );
var request = require( 'request' );

// Router
var router = express.Router();

// Forward a sensor reading to Watson IoT
// Use HTTP channel
router.post( '/sensor', function( req, res ) {
	var data = null;
  var hash = null;

  // Basic authentication
  hash = new Buffer( req.config.iot_user + ':' + req.config.iot_password ).toString( 'base64' );	

	data = req.body.data.split( ',' );
		
  request( {
    method: 'POST',
		uri: 'https://ts200f.messaging.internetofthings.ibmcloud.com:8883/api/v0002/application/types/Tessel/devices/IBM/events/stacks',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + hash
    },
    json: {
    	type: data[0],
			id: data[1],
			client: data[2],
			temperature: parseFloat( data[3] ),
			humidity: parseFloat( data[4] ),
			light: parseInt( data[5] ),
			timestamp: parseInt( data[6] ),
			color: {
				red: parseInt( data[7] ),
				green: parseInt( data[8] ),
				blue: parseInt( data[9] )
			}
    }
  }, function( error, message, response ) {
    // Whoops!
    if( error ) {
      console.log( error );
    }
		
		res.sendStatus( 200 );
  } );   	
} );

// Test
router.get( '/sensor/test', function( req, res ) {
	res.json( {stacks: 'Sensor'} );
} );
	
// Export
module.exports = router;
