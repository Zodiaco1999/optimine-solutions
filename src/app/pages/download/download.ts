import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-download',
  imports: [],
  templateUrl: './download.html',
  styleUrl: './download.css'
})
export class Download {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document?.defaultView

  deferredPrompt: any;
  showInstallButton = false;

  ngOnInit() {
    this.window!.window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;
      this.showInstallButton = true;
    });
  }

    installApp() {
    if (this.deferredPrompt !== undefined) {
      // Muestra el prompt de instalación
      this.deferredPrompt.prompt();
      // Espera la respuesta del usuario
      this.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {

          console.log('El usuario aceptó la instalación');
        } else {
          console.log('El usuario rechazó la instalación');
        }
        // Oculta el botón después de mostrar el prompt
        this.showInstallButton = false;
      });
      this.deferredPrompt = null;
    }
  }

}
