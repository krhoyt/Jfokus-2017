local JFOKUS_URL = "https://jfokus2017.mybluemix.net/api/sensor";

device.on( "report", function( csv ) {
    local headers = null;
    local json = null;
    local request = null;
    
    headers = {
        "Content-Type": "application/json"    
    };
    
    json = http.jsonencode( {
        "data": csv  
    } )
    
    request = http.post(
        JFOKUS_URL, 
        headers, 
        json
    );
    request.sendasync( function( response ) {
        server.log( response.statuscode + ":" + response.body );
    } );
} );
