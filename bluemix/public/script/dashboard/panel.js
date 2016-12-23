class Panel {
	
  constructor( path ) {
    console.log( 'Panel.' );

    // Root element
    this._element = document.querySelector( path );

    // History
    this._history = new History( path + ' > .history' );

    // Chart
    this._chart = new Chart( path + ' > svg' );
  }

}
