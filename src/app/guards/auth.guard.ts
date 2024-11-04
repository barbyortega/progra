import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('Checking authentication...'); // Mensaje de depuración
    // Verifica si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      console.log('User is not authenticated, redirecting to not-found...');
      this.router.navigate(['/not-found']);
      return false;
    }

    // Verifica si el usuario tiene el rol adecuado para acceder a la ruta
    const requiredRole = route.data['role'] as string;
    const userRole = this.authService.getUserRole();
    console.log(`Required role: ${requiredRole}, User role: ${userRole}`);

    if (requiredRole && userRole !== requiredRole) {
      console.log('User role does not match required role, redirecting to not-found...');
      this.router.navigate(['/not-found']);
      return false;
    }

    // Si pasa todas las verificaciones, permite el acceso
    return true;
  }
}
