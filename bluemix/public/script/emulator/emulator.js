class Emulator {
	
  constructor() {
    console.log( 'Emulator.' );

    this._instances = [];

    this._action = document.querySelector( 'button.action' );
    this._action.addEventListener( 'click', evt => this.doActionClick( evt ) );
  }

  doActionClick( evt ) {
    this._instances.push( new Instance() );
  }

}

// Let's do this!
var app = new Emulator();
