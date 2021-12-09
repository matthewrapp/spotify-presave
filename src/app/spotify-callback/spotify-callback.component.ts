import { Component, OnDestroy, OnInit, ɵɵsetComponentScope } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpotifyService } from '../services/spotify.service';
import { WindowService } from '../services/window.service';

@Component({
  selector: 'sp-spotify-callback',
  templateUrl: './spotify-callback.component.html',
  styleUrls: ['./spotify-callback.component.css']
})
export class SpotifyCallbackComponent implements OnInit, OnDestroy {
  userId!: string;
  queryParamsSubscription!: Subscription;
  spotifyAuthTokenSubscription!: Subscription;
  initialPresaveSubscription!: Subscription;

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, private router: Router, private windowService: WindowService) { }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(async params => {
      if (!params) return;
      return this.firstCall(params['code']);
    })
  }


  firstCall(code: string) {
    this.spotifyService.requestSpotifyTokens(code);
    this.spotifyAuthTokenSubscription = this.spotifyService.getSpotifyAuthResEvent.subscribe(result => {
      if (result.status !== 200) return this.router.navigate(['/not-found']);
      return this.secondCall(result.res.spotifyUser._id);
    })
  }

  secondCall(userId: string) {
    this.spotifyService.initialPresaveSong(userId);
    this.initialPresaveSubscription = this.spotifyService.getInitialPresaveResEvent.subscribe(result => {
      if (result.status !== 200 && result.status !== 300) return this.router.navigate(['/not-found']);
      return this.windowService.closeWindow(window);
    })
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
    this.spotifyAuthTokenSubscription.unsubscribe();
    this.initialPresaveSubscription.unsubscribe();
  }

}
