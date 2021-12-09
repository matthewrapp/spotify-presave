import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  getSpotifyCodeResEvent = new Subject<any>();
  getSpotifyAuthResEvent = new Subject<any>();
  getInitialPresaveResEvent = new Subject<any>();
  songToPresaveId!: string;

  response: any = { res: null, status: null }

  constructor(private http: HttpClient, private authService: AuthService) { }

  requestSpotifyCode() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>(`${environment.apiUrl}/spotify-code`, { headers: headers })
      .subscribe({
        next: resData => {
          this.response.res = resData;
          this.response.status = 200;
          this.getSpotifyCodeResEvent.next(this.response);
        },
        error: error => {
          this.response.res = error;
            this.response.status = error.status;
            this.getSpotifyCodeResEvent.next(this.response);
        }
      })
  }

  requestSpotifyTokens(code: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any>(`${environment.apiUrl}/spotify-tokens`, {spotifyCode: code}, { headers: headers })
      .subscribe({
        next: resData => {
          console.log('resData spotifytokens: ', resData)
          this.response.res = resData;
          this.response.status = 200;
          this.getSpotifyAuthResEvent.next(this.response);
        },
        error: error => {
          console.log('resData spotifytokens ERROR: ', error)
          this.response.res = error;
            this.response.status = error.status;
            this.getSpotifyAuthResEvent.next(this.response);
        }
      })
  }

  initialPresaveSong(userId: string) {
    this.songToPresaveId = window.name.split('=')[1]
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
    this.http.post<any>(`${environment.apiUrl}/queue-presave`, {songId: this.songToPresaveId, spotifyUserId: userId}, { headers: headers })
      .subscribe({
        next: resData => {
          console.log('resData initialpresave: ', resData)
          this.response.res = resData;
          this.response.status = 200;
          this.getInitialPresaveResEvent.next(this.response);
        },
        error: error => {
          console.log('resData initialpresave ERROR: ', error)
          this.response.res = error;
          this.response.status = error.status;
          this.getInitialPresaveResEvent.next(this.response);
        }
      })
    
  }

}
