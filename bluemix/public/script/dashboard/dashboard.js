class Dashboard {

  constructor() {
    console.log( 'Dashboard.' );

    // Panels
    this._temperature = new Panel( 'section.temperature' );
    this._humidity = new Panel( 'section.humidity' );    
    this._light = new Panel( 'section.light' );
  }
	
}

var app = new Dashboard();
