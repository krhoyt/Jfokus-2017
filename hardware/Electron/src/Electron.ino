#include "HIH61XX/HIH61XX.h"

#define PIN_PHOTOCELL A0
#define SERIAL_DEBUG
#define VERSION "0.3.0e"

HIH61XX hih( 0x27, D3 );

long interval = 5;
long last = 0;

void setup() {
  Wire.begin();

  #ifdef SERIAL_DEBUG
      Serial.begin( 9600 );
  #endif
}

void loop() {
  char client[25];
  char content[255];
  char humidity[6];
  char temperature[6];
  int photocell;

  photocell = analogRead( PIN_PHOTOCELL );
  photocell = map( photocell, 0, 4095, 0, 100 );

  hih.start();
  hih.update();

  String( hih.temperature(), 2 ).toCharArray( temperature, 6 );
  String( hih.humidity(), 2 ).toCharArray( humidity, 6 );

  if( ( Time.now() - last ) >= interval ) {
    last = Time.now();

    System.deviceID().toCharArray( client, 50 );

    sprintf(
      content,
      "Electron,IBM,%s,%s,%s,%u,%lu,255,0,0",
      client,
      temperature,
      humidity,
      photocell,
      Time.now()
    );

    Particle.publish( "environment", content, PRIVATE );

    #ifdef SERIAL_DEBUG
      Serial.println( content );
    #endif
  }
}
