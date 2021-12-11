import { Injectable } from '@angular/core';
import { NgControlStatus } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authCookie!: string;

  constructor(private cookieService: CookieService) { }

  getIsLoggedIn(): boolean {
    this.getCookie('auth');
    if (!this.authCookie) return false;
    // should validate token on server
    return true;
  }

  getCookie(cookieName: string) {
    return this.authCookie = this.cookieService.get(cookieName);
  }

  getAllCookies() {
    return this.cookieService.getAll();
  }

  setCookie(name: string, value: string): void {
    return this.cookieService.set(name, value, undefined, '/');
  }

  destroyCookie(name: string) {
    return this.cookieService.delete(name, '/');
  }

}