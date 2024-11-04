import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private navCtrl: NavController) {}

  onLogin() {
    // Navega a la página de inicio de sesión
    this.navCtrl.navigateForward('/login');
  }

  navigateToRegister() {
    // Lógica para navegar a otra página si fuera necesario
    console.log('Navegar a la página de registro');
  }
}
