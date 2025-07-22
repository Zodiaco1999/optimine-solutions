import { Injectable } from '@angular/core';
import mqtt from 'mqtt';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: mqtt.MqttClient;
  BROKER_URL = 'ws://test.mosquitto.org:8080';
  TOPIC = 'will/publica';

  constructor() {
    this.client = mqtt.connect(this.BROKER_URL);
    this.setupListeners();
  }

  private setupListeners(): void {
    this.client.on('connect', () => {
      console.log('✅ MQTT conectado');
      this.client.subscribe(this.TOPIC, (err) => {
        if (!err) {
          console.log(`📡 Suscrito a ${this.TOPIC}`);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      console.log(`📥 Mensaje recibido en ${topic}:`, message.toString());
    });

    this.client.on('error', (err) => {
      console.error('❌ Error MQTT:', err);
    });
  }

  getClient() {
    return this.client;
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }

  subscribe(topic: string) {
    this.client.subscribe(topic);
  }
}
