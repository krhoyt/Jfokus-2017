class Chart {

  constructor( path ) {
    console.log( 'Chart.' );

    // Root element
    this._element = document.querySelector( path );

    // Groups
    // One for grid
    // One for plot
    // Allows independant redraw
    this._grid = this._element.querySelector( '.chart > g:first-of-type' );
    this._plot = this._element.querySelector( '.chart > g:last-of-type' );

    // Track line history
    this._lines = [];

    // Redraw grid lines if window is resized
    // Plot lines are redrawn automatically
    // Decoupled plot line rendering
    window.addEventListener( 'resize', evt => this.build( evt ) );

    // Draw initial grid lines
    this.build();
  }
	
  // Called to draw grid lines
  // Removes existing lines first
  build() {
    var group = null;
    var line = null;
    var value = null;

    // Clean
    // Remove existing grid lines
    while( this._grid.childNodes.length > 0 ) {
      this._grid.childNodes[0].remove();      
    }    

    // Top line
    line = document.createElementNS( Chart.SVG_NAMESPACE, 'line' );
    line.setAttributeNS( null, 'x1', 0 );
    line.setAttributeNS( null, 'y1', 1 );
    line.setAttributeNS( null, 'x2', this._grid.parentNode.clientWidth );
    line.setAttributeNS( null, 'y2', 1 );
    line.setAttributeNS( null, 'stroke-dasharray', '5, 5' );
    line.setAttributeNS( null, 'stroke', 'white' );
    line.setAttributeNS( null, 'stroke-width', 1 );
    line.setAttributeNS( null, 'fill', 'none' );
    line.setAttributeNS( null, 'opacity', 0.65 );
    this._grid.appendChild( line );

    // Bottom line
    line = document.createElementNS( Chart.SVG_NAMESPACE, 'line' );
    line.setAttributeNS( null, 'x1', 0 );
    line.setAttributeNS( null, 'y1', this._grid.parentNode.clientHeight - 1 );
    line.setAttributeNS( null, 'x2', this._grid.parentNode.clientWidth );
    line.setAttributeNS( null, 'y2', this._grid.parentNode.clientHeight - 1 );
    line.setAttributeNS( null, 'stroke-dasharray', '5, 5' );
    line.setAttributeNS( null, 'stroke', 'white' );
    line.setAttributeNS( null, 'stroke-width', 1 );
    line.setAttributeNS( null, 'fill', 'none' );
    line.setAttributeNS( null, 'opacity', 0.65 );
    this._grid.appendChild( line );      

    // Divider grid lines
    for( var g = 20; g < 100; g = g + 20 ) {
      // Grouped
      // Not necessary
      // More inline with SVG behaviors
      group = document.createElementNS( Chart.SVG_NAMESPACE, 'g' );

      // Line from left to middle
      line = document.createElementNS( Chart.SVG_NAMESPACE, 'line' );
      line.setAttributeNS( null, 'x1', 0 );
      line.setAttributeNS( null, 'y1', this._grid.parentNode.clientHeight * ( g / 100 ) );
      line.setAttributeNS( null, 'x2', ( this._grid.parentNode.clientWidth / 2 ) - 25 );
      line.setAttributeNS( null, 'y2', this._grid.parentNode.clientHeight * ( g / 100 ) );
      line.setAttributeNS( null, 'stroke-dasharray', '5, 5' );
      line.setAttributeNS( null, 'stroke', 'white' );
      line.setAttributeNS( null, 'stroke-width', 1 );
      line.setAttributeNS( null, 'fill', 'none' );
      line.setAttributeNS( null, 'opacity', 0.65 );
      group.appendChild( line );

      // Value this line indicates
      // Placed in middle of viewport
      value = document.createElementNS( Chart.SVG_NAMESPACE, 'text' );
      value.textContent = ( 100 - g );
      value.setAttributeNS( null, 'font-size', 18 );
      value.setAttributeNS( null, 'font-weight', 300 );
      value.setAttributeNS( null, 'fill', 'white' );
      value.setAttributeNS( null, 'opacity', 0.65 );
      value.setAttributeNS( null, 'text-anchor', 'middle' );        
      value.setAttributeNS( null, 'alignment-baseline', 'middle' );                
      value.setAttributeNS( null, 'x', this._grid.parentNode.clientWidth / 2 );
      value.setAttributeNS( null, 'y', this._grid.parentNode.clientHeight * ( g / 100 ) );
      group.appendChild( value );

      // Line from middle to right
      line = document.createElementNS( Chart.SVG_NAMESPACE, 'line' );
      line.setAttributeNS( null, 'x1', ( this._grid.parentNode.clientWidth / 2 ) + 25 );
      line.setAttributeNS( null, 'y1', this._grid.parentNode.clientHeight * ( g / 100 ) );
      line.setAttributeNS( null, 'x2', this._grid.parentNode.clientWidth );
      line.setAttributeNS( null, 'y2', this._grid.parentNode.clientHeight * ( g / 100 ) );
      line.setAttributeNS( null, 'stroke-dasharray', '5, 5' );
      line.setAttributeNS( null, 'stroke', 'white' );
      line.setAttributeNS( null, 'stroke-width', 1 );
      line.setAttributeNS( null, 'fill', 'none' );
      line.setAttributeNS( null, 'opacity', 0.65 );
      group.appendChild( line );

      // Add line group to grid group
      this._grid.appendChild( group );
    }    
  }

}

Chart.SVG_NAMESPACE = 'http://www.w3.org/2000/svg';  
