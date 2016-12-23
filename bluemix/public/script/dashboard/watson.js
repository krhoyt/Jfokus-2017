class Watson {

  constructor( path ) {
    this._transcript = null;
    this._watson = null;
    this._xhr = null;

    // Root element
    this._element = document.querySelector( path );

    // Listen for session trigger
    this._element.addEventListener( 'click', evt => this.doWatsonClick( evt ) );
  }

  say( value ) {
    // Track desired output
    // While authenticating
    this._transcript = value;

    // Get authentication token
    this._xhr = new XMLHttpRequest();
    this._xhr.addEventListener( 'load', evt => this.doTokenText( evt ) );
    this._xhr.open( 'GET', Watson.TTS_TOKEN, true );
    this._xhr.send( null );    
  }

  doConversationLoad( evt ) {
    var data = JSON.parse( this._xhr.responseText );

    console.log( data );

    // Clean up first
    // Will be using XHR in decision tree
    this._xhr.removeEventListener( 'load', this.doConversationLoad );
    this._xhr = null;

    // Decision tree
    switch( data.intents[0].intent ) {
      case 'welcome':
        this.say( data.output.text );
        break;

      case 'help':
        window.open( data.output.text );
        break;
    }
  }

  doTokenSpeech( evt ) {
    console.log( 'Token loaded.' );

    // Start capturing
    this._watson = WatsonSpeech.SpeechToText.recognizeMicrophone( {
      continuous: false,
      objectMode: true,
      token: this._xhr.responseText
    } );    
    this._watson.on( 'data', evt => this.doWatsonData( evt ) );
    this._watson.on( 'end', evt => this.doWatsonEnd( evt ) );

    // Clean up
    this._xhr.removeEventListener( 'load', this.doTokenSpeech );
    this._xhr = null;
  }

  doTokenText( evt ) {
    WatsonSpeech.TextToSpeech.synthesize( {
      text: this._transcript,
      token: this._xhr.responseText
    } );

    this._xhr.removeEventListener( 'load', this.doTokenText );
    this._xhr = null;
  }

  doWatsonClick( evt ) {
    console.log( 'Get token.' );

    // Get authentication token
    // Token expires in one hour
    // Get with every transcript
    this._xhr = new XMLHttpRequest();
    this._xhr.addEventListener( 'load', evt => this.doTokenSpeech( evt ) );
    this._xhr.open( 'GET', Watson.STT_TOKEN, true );
    this._xhr.send( null );
  }

  doWatsonData( evt ) {
    // Keep track of changes
    this._transcript = Object.assign( {}, evt );
  }

  doWatsonEnd( evt ) {
    // Display final results
    console.log( this._transcript );
    console.log( this._transcript.results[0].alternatives[0].transcript );

    this._xhr = new XMLHttpRequest();
    this._xhr.addEventListener( 'load', evt => this.doConversationLoad( evt ) );
    this._xhr.open( 'POST', Watson.CONVERSATION, true );
    this._xhr.setRequestHeader( 'Content-Type', 'application/json' );      
    this._xhr.send( JSON.stringify( {
      text: this._transcript.results[0].alternatives[0].transcript.trim()
    } ) );
  }

}

Watson.CONVERSATION = '/api/conversation/intent';
Watson.STT_TOKEN = '/api/stt/token';
Watson.TTS_TOKEN = '/api/tts/token';
