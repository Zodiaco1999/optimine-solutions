import { Injectable } from '@angular/core';
import { connect, MqttClient } from 'mqtt';

@Injectable({
  providedIn: 'root',
})
export class MqttService {
  private client: MqttClient = connect('ws://broker.hivemq.com:8000/mqtt');

  constructor() {
  }

  private setupListeners(): void {
    this.client.on('connect', () => {
      console.log('✅ MQTT conectado');
      this.client.subscribe('datos/brayan/publica', (err) => {
        if (!err) {
          console.log('📡 Suscrito a datos/brayan/publica');
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

  publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }

  subscribe(topic: string) {
    this.client.subscribe(topic);
  }
}
