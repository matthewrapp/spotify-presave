import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { Admin } from '../models/admin.model';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  createAdminResEvent = new Subject<any>();
  loginAdminResEvent = new Subject<any>();
  response: any = { res: null, status: null }

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  writeAdmin(newAdmin: Admin): any {
    if (!newAdmin) return

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    this.http.post<any>(`${environment.apiUrl}/create-admin`, newAdmin, { headers: headers, withCredentials: true})
      .subscribe({ 
        // pass data back, just in case
        next: resData => {
          this.response.res = resData;
          this.response.status = 200;
          this.createAdminResEvent.next(this.response);
        }, 
        // if there is an error passed from the server
        error: error => {
          this.response.res = error;
          this.response.status = error.status;
          this.createAdminResEvent.next(this.response);
        } 
      });
  }

  logoutAdmin() {
    const cookie = this.authService.getCookie('auth');
    if (!cookie) return this.router.navigate(['/login']);
    const rus = this.authService.destroyCookie('auth');
    console.log('res: ', rus)
    return this.router.navigate(['/login']);
  }

  loginAdmin(email: string, password: string): any {
    if (!email) return
    if (!password) return

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const data = { email: email, password: password };


    this.http.post<any>(`${environment.apiUrl}/login-admin`, data, { headers: headers, withCredentials: true } )
      .subscribe({
        next: resData => {
          this.response.res = resData.message
          this.response.status = 200;
          // set cookie
          this.authService.setCookie('auth', resData.token);
          
          // send response
          this.loginAdminResEvent.next(this.response);
        },
        error: error => {
          this.response.res = error;
          this.response.status = error.status;
          this.loginAdminResEvent.next(this.response);
        }
      })
  }

}
