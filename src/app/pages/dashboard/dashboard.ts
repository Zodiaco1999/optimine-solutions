import { Component, OnInit } from '@angular/core';
import { MqttService } from '../../services/mqtt-servie';
import { NgxGaugeModule } from 'ngx-gauge';
import { DHTData } from '../../models/dht';

@Component({
  selector: 'app-dashboard',
  imports: [NgxGaugeModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  value: number = 0;

  thresholds = {
    '-40': { color: '#7a96f1ff'},
    '15': { color: '#2196f3' },
    '35': { color: '#ffc107' },
    '60': { color: '#f44336' }
  };

  constructor(private mqttService: MqttService) {}

  ngOnInit() {
    this.mqttService.getClient().on('message', (topic, message) => {
      const data = JSON.parse(message.toString()) as DHTData;
      if (data && data.temperatura !== undefined) {
        this.value = data.temperatura;
      }
    });
  }
}
