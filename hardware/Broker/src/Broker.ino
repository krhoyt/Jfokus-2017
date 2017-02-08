#include <Constants.h>
#include <MQTT.h>
#include <Particle_SI7021.h>
#include <SparkJson.h>

#define PHOTOCELL_PIN A0
#define REPORT_RATE 1
#define SERIAL_DEBUG
#define VERSION "0.3.0w"

MQTT client( Constants::IOT_HOST, 1883, callback );
SI7021 sensor;

long last = 0;

void setup() {
  Particle.variable( "version", VERSION );

  sensor.begin();

  #ifdef SERIAL_DEBUG
    Serial.begin( 9600 );
  #endif
}

void loop() {
  if( client.isConnected() ) {
    if( ( Time.now() - last ) >= REPORT_RATE ) {
      last = Time.now();
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
  char content[200];
  int photocell;
  String device;

  device = System.deviceID();
  char client[device.length()];
  device.toCharArray( client, device.length() );

  photocell = analogRead( PHOTOCELL_PIN );
  photocell = map( photocell, 0, 4095, 0, 100 );

  StaticJsonBuffer<250> buffer;
  JsonObject& doc = buffer.createObject();

  doc["client"] = client;
  doc["temperature"] = ( sensor.getCelsiusHundredths() / 100 );
  doc["humidity"] = sensor.getHumidityPercent();
  doc["light"] = photocell;
  doc["timestamp"] = Time.now();
  doc["type"] = "Photon";
  doc["id"] = "IBM";

  JsonObject& color = doc.createNestedObject( "color" );
  color["red"] = 0;
  color["green"] = 174;
  color["blue"] = 239;

  doc.printTo( content, sizeof( buffer ) );

  #ifdef SERIAL_DEBUG
    Serial.println( content );
  #endif

  /*
  client.publish(
    Constants::IOT_TOPIC,
    content
  );
  */
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
