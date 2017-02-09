#include <Constants.h>
#include <MQTT.h>
#include <Particle_SI7021.h>

#define PHOTOCELL_PIN A0
#define REPORT_RATE 1000
#define SERIAL_DEBUG
#define VERSION "0.3.3w"

MQTT client( Constants::IOT_HOST, 1883, callback );
SI7021 sensor;

unsigned long last = 0;

void setup() {
  Particle.variable( "version", VERSION );

  sensor.begin();

  #ifdef SERIAL_DEBUG
    Serial.begin( 9600 );
  #endif
}

void loop() {
  unsigned long now;

  if( client.isConnected() ) {
    now = millis();

    if( ( now - last ) >= REPORT_RATE ) {
      last = now;
      report();
    }

    client.loop();
  } else {
    client.connect(
      Constants::IOT_CLIENT,
      Constants::IOT_USERNAME,
      Constants::IOT_PASSWORD
    );

    #ifdef SERIAL_DEBUG
      Serial.println( "Connected." );
    #endif
  }
}

void report() {
  char device[20];
  char content[200];
  int photocell;

  System.deviceID().toCharArray( device, sizeof( device ) );

  photocell = analogRead( PHOTOCELL_PIN );
  photocell = map( photocell, 0, 4095, 0, 100 );

  snprintf(
    content,
    sizeof( content ),
    "{"
    "\"type\": \"Photon\", "
    "\"id\": \"IBM\", "
    "\"client\": \"%s\", "
    "\"temperature\": %u, "
    "\"humidity\": %u, "
    "\"light\": %u, "
    "\"timestamp\": %lu, "
    "\"color\": {"
      "\"red\": 0, "
      "\"green\": 174, "
      "\"blue\": 239"
    "}"
    "}",
    device,
    ( sensor.getCelsiusHundredths() / 100 ),
    sensor.getHumidityPercent(),
    photocell,
    Time.now()
  );

  #ifdef SERIAL_DEBUG
    Serial.println( content );
  #endif

  client.publish(
    Constants::IOT_TOPIC,
    content
  );
}

void callback( char* topic, byte* payload, unsigned int length ) {
  char p[length + 1];

  memcpy( p, payload, length );
  p[length] = NULL;

  String message( p );

  #ifdef SERIAL_DEBUG
    Serial.print( "Message: " );
    Serial.println( message );
  #endif
}
