class Dashboard {

  constructor() {
    this._temperature = document.querySelector( 'iot-panel:nth-of-type( 1 )' );
    this._temperature.addEventListener( Panel.SENSOR_COUNT, evt => this.doSensorCount( evt ) );

    this._humidity = document.querySelector( 'iot-panel:nth-of-type( 2 )' );    
    this._light = document.querySelector( 'iot-panel:nth-of-type( 3 )' );    

    this._orientation = document.querySelector( 'iot-orientation' );

    this._status = document.querySelector( 'iot-status' );
    this._status.addEventListener( Status.ALT_CLICK, evt => this.doStatusAlt( evt ) );
    this._status.addEventListener( Status.BLE_DATA, evt => this.doStatusData( evt ) );
    this._status.addEventListener( Status.LEFT_CLICK, evt => this.doStatusLeft( evt ) );    
    this._status.addEventListener( Status.SHIFT_CLICK, evt => this.doStatusShift( evt ) );
    this._status.addEventListener( Status.DROP_IMAGE, evt => this.doStatusDrop( evt ) );

    this._twitter = document.querySelector( 'twitter-field' );
    this._twitter.addEventListener( TwitterField.ENTER, evt => this.doTwitterAnalyze( evt ) );

    this._stt = document.querySelector( 'watson-stt' );
    this._stt.addEventListener( WatsonSTT.TRANSCRIPT, evt => this.doWatsonTranscript( evt ) );

    this._tts = document.querySelector( 'watson-tts' );

    this._conversation = document.querySelector( 'watson-conversation' );
    this._conversation.addEventListener( WatsonConversation.COMPLETE, evt => this.doWatsonConversation( evt ) );

    this._language = document.querySelector( 'watson-language' );
    this._language.addEventListener( WatsonLanguage.COMPLETE, evt => this.doWatsonLanguage( evt ) );    

    this._visual = document.querySelector( 'watson-visual' );
    this._visual.addEventListener( WatsonVisual.COMPLETE, evt => this.doWatsonVisual( evt ) );

    this._splash = document.querySelector( 'image-splash' );
    this._splash.addEventListener( ImageSplash.PRELOAD, evt => this.doSplashPreload( evt ) );

    this._socket = io();
    this._socket.on( 'stream', evt => this.doStreamMessage( evt ) );
    this._socket.on( 'sensor', evt => this.doSensorMessage( evt ) );
    this._socket.on( 'visual', evt => this.doVisualMessage( evt ) );
  }

  compare( a, b ) {
    if( a.score > b.score ) {
      return -1;
    }

    if( a.score < b.score ) {
      return 1;
    }

    return 0;
  }

  visual( data ) {
    var list = [];

    for( var c = 0; c < data.images[0].classifiers[0].classes.length; c++ ) {
      list.push( data.images[0].classifiers[0].classes[c].class );
    }

    console.log( list );
  }

  doSensorCount( evt ) {
    this._status.count = evt.detail.count;
  }

  doSensorMessage( data ) {
    console.log( data );    

    this._temperature.push( data );
    this._humidity.push( data );
    this._light.push( data );
  }

  doSplashPreload( evt ) {
    this._tts.say( this._tts.transcript );    
  }

  // Toggle orientation
  doStatusAlt( evt ) {
    this._orientation.toggle();
  }

  doStatusData( evt ) {
    this._socket.emit( 'ble', evt.detail );
  }

  doStatusDrop( evt ) {
    this._visual.recognize( evt.detail.source );
  }

  // Invoke speech-to-text
  doStatusLeft( evt ) {
    this._stt.listen();
  }

  doStatusShift( evt ) {
    if( this._twitter.style.display == 'flex' ) {
      TweenMax.to( this._twitter, 0.50, {
        bottom: 0,
        onComplete: function( element ) {
          element.handle = '';
          element.style.display = 'none';     
        },
        onCompleteParams: [this._twitter]
      } );
    } else {
      this._twitter.style.display = 'flex';
      TweenMax.to( this._twitter, 0.50, {
        bottom: 50
      } );
    }
  }  

  doStreamMessage( data ) {
    console.log( data );
    this._orientation.portrait = data.d.avgMode;
    this._orientation.landscape = 100 - data.d.avgMode;
  }

  doTwitterAnalyze( evt ) {
    this._language.analyze( evt.detail.handle );
  }

  doVisualMessage( evt ) {
    console.log( evt );
    this.visual( evt );

    // evt.images[0].classifiers[0].classes.sort( this.compare );
    this._tts.transcript = 'This looks like ' + evt.images[0].classifiers[0].classes[0].class;
    this._splash.show( '/uploads/' + evt.images[0].image );
  }

  doWatsonConversation( evt ) {
    switch( evt.detail.conversation.intents[0].intent ) {
      case 'welcome':
        this._tts.say( evt.detail.conversation.output.text );
        break;

      case 'help':
        window.open( evt.detail.conversation.output.text );
        break;

      case 'audience':
        this._tts.say( evt.detail.conversation.output.text );
        this._orientation.show();
        break;

      case 'impressed':
        this._tts.transcript = evt.detail.conversation.output.text;
        this._splash.show();
        break;

      case 'photo':
        this._tts.say( evt.detail.conversation.output.text );      
        this._socket.emit( 'photo', Date.now() );
        break;
    }
  }

  doWatsonLanguage( evt ) {
    if( evt.detail.language.docSentiment.type == 'positive' && 
        parseFloat( evt.detail.language.docEmotions.joy ) > 0.50 ) {
      this._tts.say( 'This might be a good day to ask for a raise.' );
    } else {
      this._tts.say( 'Probably not the best day to ask for a raise.' );
    }
  }

  doWatsonTranscript( evt ) {
    this._conversation.intent( evt.detail.transcript );
  }

  doWatsonVisual( evt ) {
    console.log( evt.detail.content );
    this.visual( evt.detail.content );

    // evt.detail.content.images[0].classifiers[0].classes.sort( this.compare );
    this._tts.transcript = 'This looks like ' + evt.detail.content.images[0].classifiers[0].classes[0].class;
    this._splash.show( '/uploads/' + evt.detail.content.images[0].image );   
  }

}

let dasboard = new Dashboard();
