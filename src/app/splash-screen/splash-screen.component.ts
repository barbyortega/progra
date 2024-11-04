import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // Simula un retraso  antes de redirigir a la página principal
    setTimeout(() => {
      this.router.navigate(['/home']); // Redirige a la página principal
    }, 1000000); 
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
