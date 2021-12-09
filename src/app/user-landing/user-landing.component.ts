import { Component, OnDestroy, OnInit, ɵɵsetComponentScope } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { SongService } from '../services/song.service';

import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { SpotifyService } from '../services/spotify.service';
import { Subscription } from 'rxjs';
import { WindowService } from '../services/window.service';

@Component({
  selector: 'sp-user-landing',
  templateUrl: './user-landing.component.html',
  styleUrls: ['./user-landing.component.css']
})
export class UserLandingComponent implements OnInit, OnDestroy {
  songData!: any;
  noSongData: Boolean = true;
  userPresaved: Boolean = false;
  songDataSubscription!: Subscription;
  spotifyCodeSubscription!: Subscription

  constructor(private router: Router, private songService: SongService, private spotifyService: SpotifyService, private windowService: WindowService) { }

  ngOnInit(): void {
    this.songService.getSongDataByUrl(this.router.url);
    this.songDataSubscription = this.songService.getSongDataResEvent.subscribe(result => {

      if (result.status !== 200) {
        this.noSongData = true;
        return this.router.navigate(['/not-found']);
      }

      this.noSongData = false;

      this.songData = result.res.songData;

      return this.songData
    })
   
  }

  ngOnDestroy() {
    if (this.songDataSubscription) this.songDataSubscription.unsubscribe();
    if (this.spotifyCodeSubscription) this.spotifyCodeSubscription.unsubscribe();
  }

  requestSpotifyCode() {
    this.spotifyService.requestSpotifyCode();
    this.spotifyCodeSubscription = this.spotifyService.getSpotifyCodeResEvent.subscribe(result => {
      const authUrl = result.res.authUrl;
      this.windowService.openWindow(authUrl, `songId=${this.songData.songId}`, "location=no,menubar=no,width=500,height=500");
      // window.open(authUrl, `songId=${this.songData.songId}`, "location=no,menubar=no,width=500,height=500");
    })
  }

}