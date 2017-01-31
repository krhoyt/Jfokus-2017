#include <Particle_SI7021.h>

#define PHOTOCELL_PIN A0
#define REPORT_RATE 1
#define SERIAL_DEBUG
#define VERSION "0.2.0p"

SI7021 sensor;

long last = 0;

void setup() {
  sensor.begin();

  #ifdef SERIAL_DEBUG
    Serial.begin( 9600 );
  #endif
}

void loop() {
  char client[50];
  char content[255];
  int photocell;

  if( ( Time.now() - last ) >= REPORT_RATE ) {
    last = Time.now();

    System.deviceID().toCharArray( client, 50 );

    photocell = analogRead( PHOTOCELL_PIN );
    photocell = map( photocell, 0, 4095, 0, 100 );

    sprintf(
      content,
      "Photon,IBM,%s,%u,%u,%u,%lu,0,174,239",
      client,
      sensor.getCelsiusHundredths() / 100,
      sensor.getHumidityPercent(),
      photocell,
      Time.now()
    );

    #ifdef SERIAL_DEBUG
      Serial.println( content );
    #endif

    Particle.publish( "environment", content, PRIVATE );
  }
}
