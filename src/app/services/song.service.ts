import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaderResponse, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class SongService implements OnInit {
    getSongsResEvent = new Subject<any>();
    presaveCreateResEvent = new Subject<any>();
    getSongDataResEvent = new Subject<any>();
    songDeletedResEvent = new Subject<any>();
    response: any = { res: null, status: null }

    constructor(private http: HttpClient, private authService: AuthService) { }

    ngOnInit() {
      
    }
    
    getSongs(): any {
        const authToken = this.authService.getCookie('auth');
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}`})

        this.http.get<any>(`${environment.apiUrl}/songs`, { headers: headers,  withCredentials: true  })
            .subscribe({
                next: resData => {
                    this.response.res = resData;
                    this.response.status = 200;
                    this.getSongsResEvent.next(this.response);
                },
                error: error => {
                    this.response.res = error;
                    this.response.status = error.status;
                    this.getSongsResEvent.next(this.response);
                }
            })
    }

    getSongDataByUrl(path: string): any {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        this.http.get<any>(`${environment.apiUrl + path}`, { headers: headers })
            .subscribe({
                next: resData => {
                    this.response.res = resData;
                    this.response.status = 200;
                    this.getSongDataResEvent.next(this.response);
                },
                error: error => {
                    this.response.res = error;
                    this.response.status = error.status;
                    this.getSongDataResEvent.next(this.response);
                }
            })
    }

    deleteSong(songId: string) {
        if (!songId) return;
        const authToken = this.authService.getCookie('auth');
        const headers =  new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}`});

        this.http.delete<any>(`${environment.apiUrl}/songs/${songId}`, {headers: headers} )
            .subscribe({
                next: resData => {
                    this.response.res = resData;
                    this.response.status = 200;
                    this.songDeletedResEvent.next(this.response);
                },
                error: error => {
                    this.response.res = error;
                    this.response.status = error.status;
                    this.songDeletedResEvent.next(this.response);
                }
            })
    }

    writePresave(newSong: Song) {
        if (!newSong) return;
        const authToken = this.authService.getCookie('auth');

        const headers =  new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}`});
        this.http.post<any>(`${environment.apiUrl}/create-presave`, newSong, { headers: headers, withCredentials: true})
            .subscribe({
                next: resData => {
                    this.response.res = resData;
                    this.response.status = 200;
                    this.presaveCreateResEvent.next(this.response);
                },
                error: error => {
                    this.response.res = error;
                    this.response.status = error.status;
                    this.presaveCreateResEvent.next(this.response);
                }
            })
    }

}
