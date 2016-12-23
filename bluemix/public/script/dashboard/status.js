class Status {

  constructor( path ) {
    console.log( 'Status.' );

    // Root element
    this._element = document.querySelector( path );
    
    // Fields
    this._count = this._element.querySelector( 'p.highlight:first-of-type' );
    this._clock = this._element.querySelector( 'p.highlight:last-of-type' );

    // Watson
    this._watson = new Watson( path + ' > div.watson' );
  }

}
