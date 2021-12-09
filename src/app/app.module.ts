import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AdminSignupComponent } from './admin-signup/admin-signup.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminSongsComponent } from './admin-songs/admin-songs.component';
import { AdminCreatePresaveComponent } from './admin-create-presave/admin-create-presave.component';
import { UserLandingComponent } from './user-landing/user-landing.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminSignupComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    SidebarComponent,
    AdminSongsComponent,
    AdminCreatePresaveComponent,
    UserLandingComponent,
    NotFoundComponent,
    SpotifyCallbackComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
