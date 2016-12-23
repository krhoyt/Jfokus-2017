class Dashboard {

  constructor() {
    console.log( 'Dashboard.' );

    // Panels
    this._temperature = new Panel( 'section.temperature' );
    this._humidity = new Panel( 'section.humidity' );    
    this._light = new Panel( 'section.light' );

    // Status bar
    this._status = new Status( '.status' );
  }
	
}

// Let's do this!
var app = new Dashboard();
