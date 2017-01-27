import json
import paho.mqtt.client as mqtt
import requests

from picamera import PiCamera

def on_connect( client, data, flags, rc ):
	print( "Connected" )
	client.subscribe( config["iot_command"] )

def on_message( client, data, msg ):
	print( "Message" )
	request = json.loads( msg.payload );

	camera.capture( config["upload_image"] )
	
	with open( config["upload_image"], "rb" ) as f:
		r = requests.post(
			config["upload_url"],
			files = {"attachment": f}
		)

	client.publish( config["iot_event"], r.text )

with open( "config.json", "r" ) as c:
	config = json.load( c )

camera = PiCamera()
camera.vflip = True
camera.resolution = ( 1024, 768 )
camera.start_preview()

client = mqtt.Client( config["client_id"] )
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set( "use-token-auth", config["iot_token"] );
client.connect( config["iot_host"], 1883 )

client.loop_forever()
