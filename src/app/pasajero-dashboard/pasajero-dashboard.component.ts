import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GoogleMapsService } from '../services/google-maps.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './pasajero-dashboard.component.html',
  styleUrls: ['./pasajero-dashboard.component.scss']
})
export class PasajeroDashboardComponent implements AfterViewInit {
  direccion: string = '';
  center = { lat: -41.469903, lng: -72.925592 };
  zoom = 12;
  markers: { lat: number, lng: number }[] = [];
  mapLoaded: boolean = false;
  userName: string = '';

  constructor(private http: HttpClient, private router: Router, private googleMapsService: GoogleMapsService) {
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

  private initMap() {
    // Inicializa el mapa una vez que la API se haya cargado
    const mapElement = document.getElementById('map') as HTMLElement; // Asegúrate de tener un contenedor en tu HTML con este ID
    const map = new google.maps.Map(mapElement, {
      center: this.center,
      zoom: this.zoom
    });

    // Aquí puedes agregar tus marcadores
    this.markers.forEach(marker => {
      new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map
      });
    });
  }

  encontrarAuto() {
    if (!this.direccion) {
      console.error('La dirección no puede estar vacía');
      return;
    }

    this.geocodeAddress(this.direccion).then(coords => {
      const autos = this.obtenerAutosCercanos(coords);
      this.markers = autos.map(auto => ({
        lat: auto.latitude,
        lng: auto.longitude
      }));

      // Si el mapa ya está cargado, actualiza los marcadores
      if (this.mapLoaded) {
        this.updateMarkers();
      }
    }).catch(error => {
      console.error('Error al geocodificar la dirección:', error);
    });
  }

  private updateMarkers() {
    // Lógica para actualizar los marcadores en el mapa
    // Asegúrate de tener acceso a la instancia del mapa
    const mapElement = document.getElementById('map') as HTMLElement;
    const map = new google.maps.Map(mapElement, {
      center: this.center,
      zoom: this.zoom
    });

    // Elimina marcadores existentes
    this.markers.forEach(marker => {
      new google.maps.Marker({
        position: { lat: marker.lat, lng: marker.lng },
        map: map
      });
    });
  }

  seleccionarAuto() {
    console.log('Auto seleccionado');
    this.router.navigate(['/seleccion-auto']);
  }

  openSettings() {
    console.log('Abrir configuración');
  }

  viewProfile() {
    console.log('Ver perfil');
  }

  viewHistory() {
    console.log('Ver historial');
  }

  requestRide() {
    console.log('Solicitar un viaje');
  }

  private async geocodeAddress(address: string): Promise<{ lat: number, lng: number }> {
    try {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${environment.googleMapsApiKey}`; // Usa la clave del entorno

      const response: any = await this.http.get(geocodeUrl).toPromise();

      if (response.status === 'OK') {
        const location = response.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error('Geocoding failed: ' + response.status);
      }
    } catch (error) {
      console.error('Error en la solicitud de geocodificación:', error);
      throw error;
    }
  }

  private obtenerAutosCercanos(coords: { lat: number, lng: number }) {
    // Simulando la obtención de autos cercanos
    return [
      { latitude: -41.4700, longitude: -72.9250 },
      { latitude: -41.4705, longitude: -72.9255 }
    ];
  }
}
