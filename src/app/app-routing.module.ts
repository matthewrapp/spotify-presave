import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AdminCreatePresaveComponent } from './admin-create-presave/admin-create-presave.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

import { AdminSignupComponent } from './admin-signup/admin-signup.component';
import { AdminSongsComponent } from './admin-songs/admin-songs.component';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { SpotifyCallbackComponent } from './spotify-callback/spotify-callback.component';
import { UserLandingComponent } from './user-landing/user-landing.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'signup', component: AdminSignupComponent },
  { path: 'login', component: AdminLoginComponent },
  { path: 'admin', children: [
    { path: 'dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] }, // take you to '/login' is not authed}
    { path: 'songs', component: AdminSongsComponent, canActivate: [AuthGuard] }, // take you to '/login' is not authed}
    { path: 'create-presave', component: AdminCreatePresaveComponent, canActivate: [AuthGuard] }, // take you to '/login' is not authed}
  ]},
  { path: ':artistName/s/:songName', component: UserLandingComponent },
  { path: ':callback', component: SpotifyCallbackComponent },
  { path: '**', component: NotFoundComponent }

]

@NgModule({
  declarations: [],
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }