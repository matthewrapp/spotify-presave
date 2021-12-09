import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authCookie!: string;

  constructor(private cookieService: CookieService) { }

  getCookie(cookieName: string) {
    return this.authCookie = this.cookieService.get(cookieName);
  }

  getAllCookies() {
    return this.cookieService.getAll();
  }

  setCookie(name: string, value: string): void {
    return this.cookieService.set(name, value);
  }

}