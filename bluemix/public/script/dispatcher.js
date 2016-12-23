class Dispatcher {
	
  // https://joshbedo.github.io/JS-Design-Patterns/
  
  static subscribe( event, handler, context ) {
    if( !this.handlers ) {
      this.handlers = [];
    }

    if( typeof context === 'undefined' ) { 
      context = handler; 
    }

    this.handlers.push( { 
      event: event, 
      handler: handler.bind( context ) 
    } );
  }

  static publish( event, args ) {
    this.handlers.forEach( topic => {
      if( topic.event === event ) {
        topic.handler( args );
      }
    } );
  }

}
