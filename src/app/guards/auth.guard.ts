import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthed = this.isLoggedIn();
    if (!isAuthed) return this.router.navigate(['/login']);
    return isAuthed;
  }

  private isLoggedIn() {
    // get cookie value
    const cookieVal = this.authService.getCookie('auth');
    // if cookie isn't found, return false
    if (!cookieVal) return false;
    // if cookie is found, return true
    return true
  }
  
}
