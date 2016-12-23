class Instance {
	
  constructor() {
    var template = null;

    console.log( 'Instance.' );

    // Reference template
    template = document.querySelector( '.instance.template' );

    // Clone and remove template styling    
    this._element = template.cloneNode( true );
    this._element.classList.remove( 'template' );

    // Generate random color for instance
    // Set visual indicator to color
    // Will be color of line in dashboard
    this._color = {
      element: this._element.querySelector( '.color' ),
      red: Math.round( Math.random() * 255 ),
      green: Math.round( Math.random() * 255 ),
      blue: Math.round( Math.random() * 255 )            
    };
    this._color.element.style.backgroundColor = 
      'rgb( ' + 
      this._color.red + ', ' + 
      this._color.green + ', ' + 
      this._color.blue + 
      ' )';
  
    // Event listener to close instance
    this._close = this._element.querySelector( 'button' );
    this._close.addEventListener( 'click', evt => this.doCloseClick( evt ) );

    document.body.insertBefore( this._element, template );
  }

  doCloseClick( evt ) {

  }

}
