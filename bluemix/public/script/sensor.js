class Sensor {

  constructor() {
    this._portrait = document.querySelector( 'iot-orientation:first-of-type' );
    this._orientation = document.querySelector( 'iot-orientation:last-of-type' );
    this._alpha = document.querySelector( 'iot-gauge:nth-of-type( 1 )' );
    this._beta = document.querySelector( 'iot-gauge:nth-of-type( 2 )' );
    this._gamma = document.querySelector( 'iot-gauge:nth-of-type( 3 )' );
    this._mode = 1;
    this._client = uuid.v4();

    this._socket = new Paho.MQTT.Client(
      Sensor.IOT_HOST, 
      8883, 
      'a:' + Sensor.IOT_ORGANIZATION + ':' + this._client
    );
    this._socket.connect( {
      userName: Sensor.IOT_USERNAME,
      password: Sensor.IOT_PASSWORD,
      useSSL: true,
      onSuccess: function() {
        console.log( 'Connected.' );
        this._interval = setInterval( this.report.bind( this ), 1000 );        
      }.bind( this )
    } );

    window.addEventListener( 'deviceorientation', evt => this.doOrientation( evt ) );     
  }
	
  report() {
    var message = null;

    console.log( this._alpha.value + ', ' + this._beta.value + ', ' + this._gamma.value );

    message = new Paho.MQTT.Message( JSON.stringify( {
      ts: new Date().toISOString(),
      d: {
        x: this._alpha.value,
        y: this._beta.value,
        z: this._gamma.value,
        mode: this._mode
      }
    } ) );
    message.destinationName = Sensor.IOT_DESTINATION;
    this._socket.send( message );   
  }

  doOrientation( evt ) {
    this._alpha.value = evt.alpha;
    this._beta.value = evt.beta;
    this._gamma.value = evt.gamma;

    // Landscape == 0
    // Portrait == 1    
    this._mode = document.body.clientWidth > document.body.clientHeight ? 0 : 1;   
  }

}

Sensor.IOT_DESTINATION = 'iot-2/type/Jfokus/id/Accelerometer/evt/sensorData/fmt/json';
Sensor.IOT_HOST = 'ts200f.messaging.internetofthings.ibmcloud.com';
Sensor.IOT_ORGANIZATION = 'ts200f';
Sensor.IOT_PASSWORD = 'lQWRcupAZqxi58A--e';
Sensor.IOT_USERNAME = 'a-ts200f-oewg5yp580';

let sensor = new Sensor();
