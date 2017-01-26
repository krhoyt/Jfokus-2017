class Emulator {

  constructor() {
    this._action = document.querySelector( '.action' );
    this._action.addEventListener( 'click', evt => this.doActionClick( evt ) );
    this._socket = io();
  }
	
  doActionClick( evt ) {
    var instance = null;

    instance = document.createElement( 'iot-instance' );
    instance.rate = 1000;
    instance.addEventListener( Instance.REPORT, evt => this.doInstanceReport( evt ) );
    document.body.appendChild( instance );
  }

  doInstanceReport( evt ) {
    console.log( evt.detail );
    this._socket.emit( Emulator.SENSOR_TYPE, evt.detail );
  }

}

Emulator.SENSOR_TYPE = 'emulator';

let emulator = new Emulator();
