class Sensor {

  constructor() {
    this._alpha = 0;
    this._beta = 0;    
    this._gamma = 0;
    this._portrait = document.querySelector( 'iot-orientation:first-of-type' );
    this._landscape = document.querySelector( 'iot-orientation:last-of-type' );
    this._mode = 1;
    this._client = uuid.v4();

    this._socket = new Paho.MQTT.Client(
      Sensor.IOT_HOST, 
      8883, 
      'a:' + Sensor.IOT_ORGANIZATION + ':' + this._client
    );
    this._socket.onMessageArrived = this.doMessage.bind( this );
    this._socket.connect( {
      userName: Sensor.IOT_USERNAME,
      password: Sensor.IOT_PASSWORD,
      useSSL: true,
      onSuccess: function() {
        console.log( 'Connected.' );
        this._socket.subscribe( Sensor.IOT_COMMAND );        
        this._interval = setInterval( this.report.bind( this ), 1000 );        
      }.bind( this )
    } );

    window.addEventListener( 'deviceorientation', evt => this.doOrientation( evt ) );     
  }
	
  map( x, in_min, in_max, out_min, out_max ) {
    return ( x - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
  } 

  report() {
    var message = null;

    console.log( this._alpha + ', ' + this._beta + ', ' + this._gamma );

    message = new Paho.MQTT.Message( JSON.stringify( {
      ts: new Date().toISOString(),
      d: {
        x: this._alpha,
        y: this._beta,
        z: this._gamma,
        mode: this._mode
      }
    } ) );
    message.destinationName = Sensor.IOT_EVENT;
    this._socket.send( message );   
  }

  doMessage( message ) {
    var data = null;

    data = JSON.parse( message.payloadString );
    console.log( data );

    this._portrait.percentage = data.d.avgMode;
    this._landscape.percentage = 100 - data.d.avgMode;
  }

  doOrientation( evt ) {
    this._alpha = evt.alpha;
    this._beta = evt.beta;
    this._gamma = evt.gamma;

    // Landscape == 0
    // Portrait == 100    
    this._mode = document.body.clientWidth > document.body.clientHeight ? 0 : 100;   
  }

}

Sensor.ALPHA_MAX = 360;  
Sensor.ALPHA_MIN = 0;
Sensor.BETA_MAX = 180; 
Sensor.BETA_MIN = -180;
Sensor.GAMMA_MAX = 90; 
Sensor.GAMMA_MIN = -90;

Sensor.IOT_COMMAND = 'iot-2/type/Jfokus/id/Accelerometer/cmd/averages/fmt/json';
Sensor.IOT_EVENT = 'iot-2/type/Jfokus/id/Accelerometer/evt/sensorData/fmt/json';
Sensor.IOT_HOST = 'ts200f.messaging.internetofthings.ibmcloud.com';
Sensor.IOT_ORGANIZATION = 'ts200f';
Sensor.IOT_PASSWORD = 'lQWRcupAZqxi58A--e';
Sensor.IOT_USERNAME = 'a-ts200f-oewg5yp580';

let sensor = new Sensor();
