#include "HIH61XX/HIH61XX.h"

#define SERIAL_DEBUG
#define PIN_PHOTOCELL A4
#define VERSION "0.2.1p"

// HIH temperature and humidity
HIH61XX hih( 0x27, D3 );

// Reporting rate
Timer sample = Timer( 5000, report );

// Setup
void setup() {
    // External check of firmware update
    Particle.variable( "version", VERSION );

    // Control the LED
    // Photocell is ADC by default
    pinMode( LED_PIN, OUTPUT );

    // Communicate with sensor
    Wire.begin();

    // Debug
    #ifdef SERIAL_DEBUG
        // Serial output
        Serial.begin( 9600 );
    #endif

    // Start reporting
    sample.start();
}

// Loop
void loop() {;}

void report() {
    char content[255];
    char humidity[6];
    char light[6];
    char photon[50];
    char temperature[6];
    int photocell;

    // Get light level
    // Map to percentange range
    photocell = analogRead( PHOTOCELL_PIN );
    photocell = map( photocell, 0, 4095, 0, 100 );

    // Start the sensor
    // Request an update
    hih.start();
    hih.update();

    // Get values as character arrays
    System.deviceID().toCharArray( photon, 50 );
    String( hih.temperature(), 2 ).toCharArray( temperature, 6 );
    String( hih.humidity(), 2 ).toCharArray( humidity, 6 );

    // Format data
    // "{ \"sensor\": \"%s\", \"temperature\": %s, \"humidity\": %s, \"light\": %u, \"timestamp\": %lu }",
    // "%s,%s,%s,%u,%lu"

    // Format report
    sprintf(
        content,
        "Tessel,IBM,%s,%s,%s,%u,%lu,255,0,0",
        photon,
        temperature,
        humidity,
        photocell,
        Time.now()
    );

    Particle.publish( "environment", content, PRIVATE );

    // Debug
    #ifdef SERIAL_DEBUG
        Serial.print( "Version: " );
        Serial.println( VERSION );

        Serial.print( "Humidity: " );
        Serial.println( humidity );

        Serial.print( "Temperature: " );
        Serial.println( temperature );

        Serial.print( "Light: " );
        Serial.println( photocell );

        Serial.println( content );
    #endif
}
