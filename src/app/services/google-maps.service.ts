import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; // Asegúrate de importar el entorno

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  constructor() { }

  loadMapsAPIFunction(libraries: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      // Comprobar si Google Maps ya está cargado
      if (typeof google !== 'undefined' && google.maps) {
        resolve(); // La API ya está cargada
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=${libraries.join(',')}&callback=initMap`;
      script.async = true; // Carga asíncrona
      script.defer = true; // Asegura que el script se ejecute después de que el documento se haya analizado
      script.onload = () => resolve(); // Resuelve la promesa cuando se carga
      script.onerror = (error: any) => reject(error); // Rechaza la promesa si hay un error
      document.head.appendChild(script); // Añade el script al head del documento
    });
  }
}
