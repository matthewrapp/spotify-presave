import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { Admin } from '../models/admin.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  artistsChangedResEvent = new Subject<any>();
  response: any = { res: null, status: null }

  constructor(private http: HttpClient, private authService: AuthService) { }

  getArtists() {
    const authToken = this.authService.getCookie('auth');
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}`})

    this.http.get<any>(`${environment.apiUrl}/artists`, { headers: headers, withCredentials: true })
      .subscribe({
        next: resData => {
          this.response.res = resData;
          this.response.status = 200;
          this.artistsChangedResEvent.next(this.response);
        },
        error: error => {
          this.response.res = error;
          this.response.status = error.status;
          this.artistsChangedResEvent.next(this.response);
        }
      })
  }
}
