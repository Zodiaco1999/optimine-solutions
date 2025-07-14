import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  imports: [],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav implements OnInit {
  activeMenu = false;
  counter = 0;


  ngOnInit(): void {
    console.log('Nav component initialized');
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {

  }

  getProfile() {

  }

}
