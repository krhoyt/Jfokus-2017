#include <HIH61XX.h>
#include <Wire.h>

HIH61XX hih( 0x27 );

void setup() {
  Serial.begin( 9600 );
  
  Wire.begin();
  Bean.enableWakeOnConnect( true );
}

void loop() {
  char content[20];
  char temperature[6];
  int photocell;
  uint8_t scratch[20];
  
  if( Bean.getConnectionState() ) {
    photocell = analogRead( A0 );
    
    hih.start();
    hih.update();

    dtostrf( hih.temperature(), 3, 2, temperature );

    sprintf(
      content,
      "%s,%u,%u",
      temperature,
      ( int )( hih.humidity() * 100 ),
      map( photocell, 0, 1024, 0, 100 )
    );

    Serial.println( content );

    for( int i = 0; i < strlen( content ); i++ ) {
      scratch[i] = content[i];
    }

    Bean.setScratchData( 1, scratch, strlen( content ) );    
    Bean.sleep( 1000 );
  } else {
    Bean.sleep( 0xFFFFFFFF );
  }
}

