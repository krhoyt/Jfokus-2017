class Status {

  constructor( path ) {
    console.log( 'Status.' );

    // Root element
    this._element = document.querySelector( path );
    
    // Fields
    this._count = this._element.querySelector( 'p.highlight:first-of-type' );
    this._clock = this._element.querySelector( 'p.highlight:last-of-type' );

    // Hit area
    // Used for special features
    this._hit = this._element.querySelector( 'div' );
    this._hit.addEventListener( 'click', evt => this.doHitClick( evt ) );
  }
	
  doHitClick() {
    console.log( 'Hit!' );
  }

}
