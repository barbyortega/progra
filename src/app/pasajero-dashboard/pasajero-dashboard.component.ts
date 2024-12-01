import { Component, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleMapsService } from '../services/google-maps.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './pasajero-dashboard.component.html',
  styleUrls: ['./pasajero-dashboard.component.scss'],
})
export class PasajeroDashboardComponent implements AfterViewInit, OnInit {
  direccion: string = '';
  center = { lat: -41.469903, lng: -72.925592 };
  zoom = 12;
  markers: { lat: number, lng: number }[] = [];
  mapLoaded: boolean = false;
  userName: string = '';

  origen: string = ''; 
  destino: string = ''; 

  map: google.maps.Map | null = null;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  constructor(
    private http: HttpClient,
    private router: Router,
    private googleMapsService: GoogleMapsService
  ) {
    this.userName = localStorage.getItem('userName') || 'Pasajero';
  }

  async ngAfterViewInit() {
    try {
      await this.googleMapsService.loadMapsAPIFunction(['places']); // Carga la API de Google Maps con la biblioteca de lugares
      this.initMap(); // Inicializa el mapa aquí
      this.mapLoaded = true; // Marca que el mapa se ha cargado
    } catch (error) {
      console.error('Error loading Google Maps API:', error);
    }
  }

  ngOnInit() {
    // Inicializa el mapa cuando se carga el componente
    this.googleMapsService
      .loadMapsAPIFunction(['places'])
      .then(() => this.initMap())
      .catch((err) => console.error('Error al cargar Google Maps:', err));
  }

  private initMap() {
    const mapElement = document.getElementById('map') as HTMLElement;

    this.map = new google.maps.Map(mapElement, {
      center: this.center,
      zoom: this.zoom,
    });

    this.directionsRenderer.setMap(this.map);
  }

  calcularRuta() {
    if (!this.origen || !this.destino) {
      console.error('Debe ingresar origen y destino.');
      return;
    }
  
    // Geocodificar las direcciones
    this.geocodeAddress(this.origen).then((origenCoords) => {
      this.geocodeAddress(this.destino).then((destinoCoords) => {
        this.directionsService.route(
          {
            origin: origenCoords,
            destination: destinoCoords,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              this.directionsRenderer.setDirections(result);
            } else {
              console.error('Error al calcular la ruta:', status);
            }
          }
        );
      }).catch(err => {
        console.error('Error al geocodificar el destino:', err);
      });
    }).catch(err => {
      console.error('Error al geocodificar el origen:', err);
    });
  }
  
  // Método para geocodificar una dirección
  private geocodeAddress(address: string): Promise<google.maps.LatLngLiteral> {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
  
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject('Geocoding failed: ' + status);
        }
      });
    });
  }
  
  

  logout() {
    localStorage.removeItem('userName');
    this.router.navigate(['/home']);
  }

  requestRide() {
    console.log('Solicitar un viaje');
    this.router.navigate(['/seleccion-auto']);
  }

  seleccionarAuto() {
    console.log('Auto seleccionado');
    this.router.navigate(['/seleccion-auto']);
  }

  mostrarRutas() {
    if (!this.origen || !this.destino) {
      console.error('Debes establecer tanto el origen como el destino.');
      return;
    }
    this.calcularRuta();
  }

  openSettings() {
    console.log('Abrir configuración');
  }
}
