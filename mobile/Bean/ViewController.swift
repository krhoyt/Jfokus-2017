import CocoaMQTT
import CoreBluetooth
import SwiftyJSON
import UIKit

class ViewController: UIViewController, CBCentralManagerDelegate, CBPeripheralDelegate {
    
    var manager:CBCentralManager!
    var peripheral:CBPeripheral!
    
    let BEAN_NAME = "Bean+"
    let BEAN_SCRATCH_UUID = CBUUID(string: "a495ff21-c5b1-4b44-b512-1370f02d74de")
    let BEAN_SERVICE_UUID = CBUUID(string: "a495ff20-c5b1-4b44-b512-1370f02d74de")
    
    var mqtt:CocoaMQTT!
    
    let CLIENT_ID = "a:" + Constants.IOT_ORGANIZATION + ":" + UUID().uuidString
    
    @IBOutlet weak var lblTemperature: UILabel!
    @IBOutlet weak var lblHumidity: UILabel!
    @IBOutlet weak var lblLight: UILabel!
    @IBOutlet weak var stkReading: UIStackView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        lblTemperature.isHidden = true;
        lblHumidity.isHidden = true;
        lblLight.isHidden = true;
        
        manager = CBCentralManager(delegate: self, queue: nil)
        
        mqtt = CocoaMQTT(
            clientID: CLIENT_ID,
            host: Constants.IOT_ORGANIZATION + ".messaging.internetofthings.ibmcloud.com",
            port: 1883
        )
        
        mqtt.username = Constants.IOT_USERNAME
        mqtt.password = Constants.IOT_PASSWORD
        mqtt.delegate = self
        mqtt.connect()
    }
    
    func centralManagerDidUpdateState(_ central:CBCentralManager) {
        if central.state == CBManagerState.poweredOn {
            central.scanForPeripherals(withServices: nil, options: nil)
            debugPrint("Searching ...")
        } else {
            debugPrint("Bluetooth not available.")
        }
    }
    
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        let device = (advertisementData as NSDictionary).object(forKey: CBAdvertisementDataLocalNameKey) as? NSString
        
        if device?.contains(BEAN_NAME) == true {
            debugPrint("Found Bean.")
            
            self.manager.stopScan()
            self.peripheral = peripheral
            self.peripheral.delegate = self
            
            manager.connect(peripheral, options: nil)
        }
    }
    
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        debugPrint("Getting services ...")
        peripheral.discoverServices(nil)
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        for service in peripheral.services! {
            let thisService = service as CBService
            
            debugPrint("Service: ", service.uuid)
            
            if service.uuid == BEAN_SERVICE_UUID {
                debugPrint("Using scratch.")
                peripheral.discoverCharacteristics(nil, for: thisService)
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        debugPrint("Enabling ...")
        
        for characteristic in service.characteristics! {
            let thisCharacteristic = characteristic as CBCharacteristic
            
            debugPrint("Characteristic: ", thisCharacteristic.uuid)
            
            if thisCharacteristic.uuid == BEAN_SCRATCH_UUID {
                debugPrint("Set to notify: ", thisCharacteristic.uuid)
                
                lblTemperature.text = "";
                lblTemperature.isHidden = false;
                
                lblHumidity.text = "";
                lblHumidity.isHidden = false;
                
                lblLight.text = "";
                lblLight.isHidden = false;
                
                self.peripheral.setNotifyValue(true, for: thisCharacteristic)
            }
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        if characteristic.uuid == BEAN_SCRATCH_UUID {
            let content = String(data: characteristic.value!, encoding: String.Encoding.utf8)
            let values = content?.components(separatedBy: ",")
            let temperature = Int(Float(values![0])!)
            let humidity = Int(values![1])
            let light = Int(values![2])

            lblTemperature.text = String(temperature)
            lblHumidity.text = String(humidity!)
            lblLight.text = String(light!)

            let json = JSON([
                "type": "Bean",
                "id": "IBM",
                "client": CLIENT_ID,
                "temperature": temperature,
                "humidity": humidity!,
                "light": light!,
                "timestamp": Int(Date().timeIntervalSince1970),
                "color": [
                    "red": 0,
                    "green": 173,
                    "blue": 238
                ]
            ])

            mqtt!.publish(Constants.IOT_TOPIC, withString: json.rawString()!)
        }
    }
    
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        debugPrint("Disconnected.")
        
        central.scanForPeripherals(withServices: nil, options: nil)
        
        lblTemperature.isHidden = true;
        lblHumidity.isHidden = true;
        lblLight.isHidden = true;
    }
    
}

extension ViewController: CocoaMQTTDelegate {
    func mqtt(_ mqtt: CocoaMQTT, didConnect host: String, port: Int) {
        debugPrint("Connected.")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didConnectAck ack: CocoaMQTTConnAck) {
        debugPrint("Connect ACK.")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didPublishMessage message: CocoaMQTTMessage, id: UInt16) {
        debugPrint("Publish.")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didPublishAck id: UInt16) {
        debugPrint("Publish ACK.")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didReceiveMessage message: CocoaMQTTMessage, id: UInt16 ) {
        debugPrint("Message.")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didSubscribeTopic topic: String) {
        debugPrint("Subscribed.")
    }
    
    func mqtt(_ mqtt: CocoaMQTT, didUnsubscribeTopic topic: String) {
        debugPrint("Unsubscribe.")
    }
    
    func mqttDidPing(_ mqtt: CocoaMQTT) {
        debugPrint("Ping.")
    }
    
    func mqttDidReceivePong(_ mqtt: CocoaMQTT) {
        debugPrint("Pong.")
    }
    
    func mqttDidDisconnect(_ mqtt: CocoaMQTT, withError err: Error?) {
        debugPrint("Disconnect.")
    }
}
