import { Component, OnInit } from '@angular/core';
import { MqttService } from '../../services/mqtt-servie';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  constructor(private mqttService: MqttService) {

  }

  ngOnInit(): void {
  }


}
