import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sp-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'spotify-presave';
  showNav!: Boolean;
  routerSubscription!: Subscription;
  currentUrl!: string;

  constructor( private router: Router, private route: ActivatedRoute) { };

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
        if (this.currentUrl.split('/')[1] !== 'admin') return this.showNav = false;
        return this.showNav = true;
      }

      return
    })
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }
}
