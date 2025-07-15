import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [
    RouterLink
  ],
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
