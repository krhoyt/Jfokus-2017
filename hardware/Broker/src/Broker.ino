#include "Constants.h"
#include <MQTT.h>
#include <Particle_SI7021.h>
#include <SparkJson.h>

#define PHOTOCELL_PIN A0
#define SERIAL_DEBUG
#define VERSION "0.2.5p"

void callback( char* topic, byte* payload, unsigned int length );

MQTT client( Constants::IOT_HOST, 1883, callback );
SI7021 sensor;

char device[50];

void setup() {
  System.deviceID().toCharArray( device, 50 );

  sensor.begin();

  #ifdef SERIAL_DEBUG
    Serial.begin( 9600 );
  #endif
}

void loop() {
  int photocell;

  if( client.isConnected() ) {
    photocell = analogRead( PHOTOCELL_PIN );
    photocell = map( photocell, 0, 4095, 0, 100 );

    StaticJsonBuffer<200> buffer;
    JsonObject& json = buffer.createObject();
    json["type"] = "Broker";
    json["id"] = "IBM";
    json["client"] = device;
    json["temperature"] = ( sensor.getCelsiusHundredths() / 100 );
    json["humidity"] = sensor.getHumidityPercent();
    json["light"] = photocell;
    json["timestamp"] = Time.now();

    JsonObject& color = buffer.createObject();
    color["red"] = 0;
    color["green"] = 174;
    color["blue"] = 239;

    // json["color"] = color;

    #ifdef SERIAL_DEBUG
      json.printTo( Serial );
    #endif

    /*
    client.publish(
      Constants::IOT_TOPIC,
      "{" +
      "\"type\": \"Broker\", " +
      "\"id\": \"IBM\", " +
      "\"client\": \"" + device + "\", " +
      "\"temperature\": " + ( sensor.getCelsiusHundredths() / 100 ) + ", " +
      "\"humidity\": " + sensor.getHumidityPercent() + ", " +
      "\"light\": " + photocell + ", " +
      "\"timestamp\": " + Time.now() + ", " +
      "\"color\": {" +
      "\"red\": 0, " +
      "\"green\": 174, " +
      "\"blue\": 239 " +
      "}" +
      "}"
    );
    */
  } else {
    client.connect(
      Constants::IOT_CLIENT,
      Constants::IOT_USERNAME,
      Constants::IOT_PASSWORD
    );
  }

  client.loop();
}
