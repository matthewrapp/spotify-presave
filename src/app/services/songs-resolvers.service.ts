// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
// import { catchError, Observable, of } from 'rxjs';
// import { SongService } from './song.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class SongsResolversService implements Resolve<any> {

//   constructor(private songService: SongService) { }

//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> | Observable<any> | any {
//     return this.songService.getSongs().pipe(catchError((error: string) => of(error)));
//   }

// }
