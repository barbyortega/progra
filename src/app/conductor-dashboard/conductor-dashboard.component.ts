//conductor-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TripService } from '../services/trip.service';
import { AuthService } from '../services/auth.service';
import { Trip } from '../models/trip.model';


@Component({
  selector: 'app-conductor-dashboard',
  templateUrl: './conductor-dashboard.component.html',
  styleUrls: ['./conductor-dashboard.component.scss']
})
export class ConductorDashboardComponent implements OnInit {
  trips: Trip[] = []; // Usa el modelo Trip en lugar de any[]
  isLoading: boolean = false;
  error: string = '';
  userName: string = ''; // Para almacenar el nombre del usuario


  // Propiedades para el mapa
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom: number = 8;


  constructor(
    private router: Router,
    private tripService: TripService,
    private authService: AuthService
  ) { }


  ngOnInit() {
    this.loadTrips();
    this.userName = localStorage.getItem('userName') || 'Invitado';


    // Configura la ubicación inicial del mapa
    this.setInitialMapLocation();
  }
 
  loadTrips() {
    this.isLoading = true;
    this.tripService.getTrips().subscribe({
      next: (data) => {
        this.trips = data;
        this.isLoading = false;
        console.log('Conexión a la API exitosa'); // Mensaje en la consola
      },
      error: (err) => {
        this.error = 'No se pudo cargar la información de los viajes.';
        console.error(err); // Log de error para mayor visibilidad
        this.isLoading = false;
      }
    });
  }


  setInitialMapLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.zoom = 12; // Ajusta el nivel de zoom si es necesario
      }, () => {
        this.setDefaultLocation(); // Llama a una función para establecer ubicación de respaldo
      });
    } else {
      this.setDefaultLocation(); // Llama a una función para establecer ubicación de respaldo
    }
  }


  setDefaultLocation() {
    this.center = { lat: -41.469903, lng: -72.925592 }; // Ubicación de respaldo
    this.zoom = 8; // Ajusta el zoom de respaldo si es necesario
  }


  viewRoutes() {
    this.router.navigate(['/routes']);
  }


  requestHelp() {
    // Lógica para solicitar ayuda
    console.log('Solicitar ayuda');
  }


  viewProfile() {
    this.router.navigate(['/profile']);
  }


  logout() {
    // Limpiar la información de la sesión, por ejemplo:
    localStorage.removeItem('userName');
    // Redirigir a la página de inicio
    this.router.navigate(['/home']); // Asegúrate de que esta ruta coincida con tu configuración de rutas
  }
}


