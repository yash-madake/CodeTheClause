// src/services/bluetooth.js

// Standard BLE Heart Rate Service UUIDs
const HEART_RATE_SERVICE = 'heart_rate';
const HEART_RATE_MEASUREMENT = 'heart_rate_measurement';

export const bluetooth = {
    device: null,
    server: null,

    // 1. Connect to a nearby BLE Device
    connect: async () => {
        if (!navigator.bluetooth) {
            throw new Error("Web Bluetooth is not supported in this browser. Use Chrome or Edge.");
        }

        console.log("Requesting Bluetooth Device...");
        
        // Request device that supports Heart Rate
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [HEART_RATE_SERVICE] }]
        });

        console.log("Connecting to GATT Server...");
        const server = await device.gatt.connect();
        
        bluetooth.device = device;
        bluetooth.server = server;
        
        return device;
    },

    // 2. Start Listening for Heart Rate Data
    startStreaming: async (onDataReceived) => {
        if (!bluetooth.server) throw new Error("Device not connected");

        console.log("Getting Heart Rate Service...");
        const service = await bluetooth.server.getPrimaryService(HEART_RATE_SERVICE);

        console.log("Getting Characteristic...");
        const characteristic = await service.getCharacteristic(HEART_RATE_MEASUREMENT);

        console.log("Starting Notifications...");
        await characteristic.startNotifications();

        characteristic.addEventListener('characteristicvaluechanged', (event) => {
            const value = event.target.value;
            const heartRate = parseHeartRate(value);
            onDataReceived(heartRate);
        });
    },

    disconnect: () => {
        if (bluetooth.device && bluetooth.device.gatt.connected) {
            bluetooth.device.gatt.disconnect();
        }
    }
};

// Helper: Decode the standard BLE Heart Rate byte stream
function parseHeartRate(value) {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let result = {};
    
    if (rate16Bits) {
        result.heartRate = value.getUint16(1, /*littleEndian=*/true);
    } else {
        result.heartRate = value.getUint8(1);
    }
    return result.heartRate;
}