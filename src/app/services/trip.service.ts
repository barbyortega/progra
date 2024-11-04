import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  // Datos de ejemplo con rutas que comienzan en Duoc UC y tarifas en pesos chilenos.
  private trips = [
    { id: 1, route: 'Duoc UC a Alerce', fare: '1200 CLP' },
    { id: 2, route: 'Duoc UC a Mirasol', fare: '700 CLP' },
    { id: 3, route: 'Duoc UC a Puerto Varas', fare: '1500 CLP' },
    { id: 4, route: 'Duoc UC a Tepual', fare: '1300 CLP' },
    { id: 5, route: 'Duoc UC a Los Muermos', fare: '1700 CLP' }
  ];

  constructor() { }

  // Método para obtener la lista de viajes
  getTrips(): Observable<any[]> {
    return of(this.trips);
  }

  // Método para obtener un viaje por ID
  getTripById(id: number): Observable<any> {
    const trip = this.trips.find(t => t.id === id);
    return of(trip);
  }

  // Método para agregar un nuevo viaje
  addTrip(trip: any): Observable<any> {
    this.trips.push(trip);
    return of(trip);
  }

  // Método para actualizar un viaje existente
  updateTrip(id: number, updatedTrip: any): Observable<any> {
    const index = this.trips.findIndex(t => t.id === id);
    if (index !== -1) {
      this.trips[index] = { ...this.trips[index], ...updatedTrip };
      return of(this.trips[index]);
    }
    return of(null);
  }

  // Método para eliminar un viaje
  deleteTrip(id: number): Observable<boolean> {
    const index = this.trips.findIndex(t => t.id === id);
    if (index !== -1) {
      this.trips.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
