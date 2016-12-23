class History {

  constructor( path ) {
    console.log( 'History.' );

    // Root element
    this._element = document.querySelector( path );

    // Field references
    // Keep values without rounding
    this._minimum = {
      element: this._element.querySelector( 'div:nth-of-type( 1 ) > p:nth-of-type( 2 )' ),
      value: null
    };
    this._maximum = {
      element: this._element.querySelector( 'div:nth-of-type( 2 ) > p:nth-of-type( 2 )' ),
      value: null 
    };
    this._current = {
      element: this._element.querySelector( 'div:nth-of-type( 3 ) > p:nth-of-type( 2 )' ),
      value: null
    };

    // Sensor references
    this._sensor = [];
  }

  get current() {
    return this._current.value;
  }

  set current( value ) {
    this._current.value = value;
    this._current.element.innerHTML = Math.round( value );
  }

  get maximum() {
    return this._maximum.value;
  }

  set maximum( value ) {
    this._maximum.value = value;
    this._maximum.element.innerHTML = Math.round( value );
  }
	
  get minimum() {
    return this._minimum.value;
  }

  set minimum( value ) {
    this._minimum.value = value;
    this._minimum.element.innerHTML = Math.round( value );
  }

}
