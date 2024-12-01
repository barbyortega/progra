//auth.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


interface User {
  email: string;
  password: string;
  name: string;
  role: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private validUsers = [
    { email: 'isa@gmail.com', password: '1630', name: 'Isa Alvarado', role: 'conductor' },
    { email: 'raquel@gmail.com', password: '1996', name: 'Raquel Rehbein', role: 'conductor' },
    { email: 'martina@gmail.com', password: '2024', name: 'Martina González', role: 'pasajero' }
  ];


  constructor() {}


  // Método para registrar usuarios
  registrar(nombre: string, correo: string, contrasena: string, rol: string): Observable<any> {
    const userData: User = { email: correo, password: contrasena, name: nombre, role: rol };


    // Simulación de guardado de usuario en el almacenamiento local
    const response = { success: true, name: nombre };


    if (response.success) {
      // Guardar el usuario en localStorage
      const usuariosRegistrados = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      usuariosRegistrados.push(userData);
      localStorage.setItem('registeredUsers', JSON.stringify(usuariosRegistrados));
    }


    return of(response);
  }


  // Método para manejar el inicio de sesión (validación local)
  login(email: string, password: string): Observable<{ success: boolean, role: string, name?: string }> {
    const usuariosRegistrados = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
   
    // Buscar el usuario en ambos arrays (validUsers y usuarios registrados)
    const user = [...this.validUsers, ...usuariosRegistrados].find(
      user => user.email === email && user.password === password
    );


    if (user) {
      // Guardamos la información del usuario en el localStorage
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', user.role);
      console.log('User logged in:', { name: user.name, role: user.role });
      return of({ success: true, role: user.role, name: user.name });
    } else {
      console.log('Login failed for:', email);
      return of({ success: false, role: '', name: '' });
    }
  }


  // Método para cerrar sesión
  logout(): Observable<void> {
    this.clearStorage(); // Llamar al método para limpiar el almacenamiento
    return of(); // Retornamos un observable vacío
  }


  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userName');
  }


  // Método para obtener el nombre del usuario
  getUserName(): string | null {
    return localStorage.getItem('userName');
  }


  // Método para obtener el rol del usuario
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }


  // Método para recuperar la contraseña
  recuperarContrasena(correo: string, nuevaContrasena: string, codigo: string): Observable<{ success: boolean }> {
    const usuariosRegistrados: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');


    // Buscar el índice del usuario con el correo proporcionado
    const userIndex = usuariosRegistrados.findIndex((user) => user.email === correo);


    if (userIndex !== -1) {
      // Simulamos una validación para verificar si el código es correcto (puedes adaptarlo a tu lógica)
      // El código de validación aquí es simulado para ser "1234"
      if (codigo !== '1234') {  // Aquí un código de validación simulado
        return of({ success: false }); // Código inválido
      }


      // Actualizar la contraseña en el localStorage
      usuariosRegistrados[userIndex].password = nuevaContrasena;
      localStorage.setItem('registeredUsers', JSON.stringify(usuariosRegistrados));
      console.log('Contraseña actualizada para:', correo);
      return of({ success: true }); // Retornar un objeto con success: true
    } else {
      console.log('Correo no encontrado:', correo);
      return of({ success: false }); // Retornar un objeto con success: false
    }
  }


  // Método para enviar un código de validación al correo
  enviarCodigoValidacion(correo: string): Observable<{ success: boolean }> {
    // Simulamos el envío de un código de validación al correo
    const codigoEnviado = true; // Simulación de la lógica de envío del código


    if (codigoEnviado) {
      console.log('Código de validación enviado a:', correo);
      return of({ success: true });
    } else {
      console.log('Error al enviar el código a:', correo);
      return of({ success: false });
    }
  }


  // Método para limpiar el almacenamiento
  private clearStorage(): void {
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
  }
}


