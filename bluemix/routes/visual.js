var express = require( 'express' );
var fs = require( 'fs' );
var multer = require( 'multer' );
var randomstring = require( 'randomstring' );
var request = require( 'request' );

var VERSION = '&version=2016-05-20';
var WATSON_CLASSIFY = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify';

// Router
var router = express.Router();

// Upload storage options
// Unique name with extension
var storage = multer.diskStorage( {
  destination: 'public/uploads',
    filename: function( req, file, cb ) {
      cb( null, randomstring.generate() + '.jpg' );
    }
} );

// Upload handler
var upload = multer( {
    storage: storage
} );

// Delete all files in upload directory
// Clean up
router.delete( '/visual/clean', function( req, res ) {
    var files = null;
    var path = null;
    
    // Get list of files
    files = fs.readdirSync( __dirname + '/../public/uploads' );

    // Iterate
    for( var f = 0; f < files.length; f++ ) {
        // Isolate path
        path = __dirname + '/../public/uploads/' + files[f];

        // Check for file (not directory)
        // Delete file
        if( fs.statSync( path ).isFile() ) {
            fs.unlinkSync( path );            
        }
    }
    
    // Done
    res.send( 'OK' );
} );

// Image upload
router.post( '/visual/recognize', upload.single( 'attachment' ), function( req, res ) {
  var url = null;
    
  url = 
    WATSON_CLASSIFY +
    '?api_key=' + req.config.visual.api_key +
    VERSION;
    
  // Multipart file upload to Watson
  request( {
    method: 'POST',
    url: url,
    formData: {
      parameters: fs.createReadStream( __dirname + '/parameters.json' ),
        images_file: fs.createReadStream( __dirname + '/../' + req.file.path )
      }
    }, function( err, result, body ) {    
      res.send( body );        
    } );    
} );

// Test
router.get( '/visual/test', function( req, res ) {    
  res.json( {watson: 'Visual Recognition'} );
} );
  
// Export
module.exports = router;
