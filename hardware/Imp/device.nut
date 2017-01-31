#require "Si702x.class.nut:1.0.0"

hardware.i2cAB.configure( CLOCK_SPEED_400_KHZ );
hardware.pinK.configure( ANALOG_IN );

sensor <- Si702x( hardware.i2cAB );    

function map( x, in_min, in_max, out_min, out_max ) {
    return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
} 

function report()
{
    sensor.read( function( result ) {
        local csv = null;
        local photocell = null;
        
        photocell = hardware.pinK.read();
        photocell = map( photocell, 0, 65535, 0, 100 );
        
        csv = format( 
            "Imp,IBM,%s,%.01f,%.01f,%u,%u,163,206,103",
            imp.getmacaddress(),
            result.temperature, 
            result.humidity,
            photocell,
            time()
        );
        
        server.log( csv );
        
        agent.send( "report", csv );
        
        imp.wakeup( 1, report );        
    } );    
}
 
report();
