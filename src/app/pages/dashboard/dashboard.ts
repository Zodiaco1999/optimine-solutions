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
  temp1: number = 0;
  temp2: number = 0;
  size: number = 400;

  thresholds1 = {
    '-40': { color: '#7a96f1ff'},
    '15': { color: '#2196f3' },
    '35': { color: '#ffc107' },
    '60': { color: '#f44336' }
  };

  thresholds2 = {
    '-40': { color: '#28f049ff'},
    '15': { color: '#1eda06ff' },
    '35': { color: '#ffc107' },
    '60': { color: '#f44336' }
  };


  constructor(private mqttService: MqttService) {}

  ngOnInit() {
    this.mqttService.getClient().on('message', (topic, message) => {
      const data = JSON.parse(message.toString()) as DHTData;
      if (data && data.temperatura_uno !== undefined) {
        this.temp1 = data.temperatura_uno;
        this.temp2 = data.temperatura_dos ;
      }
    });
     this.updateSize();
    window.addEventListener('resize', this.updateSize.bind(this));
  }

  updateSize() {
    this.size = window.innerWidth <= 600 ? 200 : 400;
  }
}
