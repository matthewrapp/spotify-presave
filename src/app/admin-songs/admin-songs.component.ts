import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Song } from '../models/song.model';
import { AuthService } from '../services/auth.service';
import { SongService } from '../services/song.service';

@Component({
  selector: 'sp-admin-songs',
  templateUrl: './admin-songs.component.html',
  styleUrls: ['./admin-songs.component.css']
})
export class AdminSongsComponent implements OnInit, OnDestroy {
  faEdit = faEdit;
  faDelete = faTrash;
  songs!: [any]
  artist!: any
  noSongs: Boolean = true;
  getSongsSubscription!: Subscription;
  deleteSongSubscription!: Subscription;

  constructor(private authService: AuthService, private songService: SongService) { }

  ngOnInit(): void {
    this.getSongs();
  }

  getSongs() {
    this.getSongsSubscription = this.songService.getSongs()
      .subscribe({
        next: resData => {
          if (resData.songs.length === 0) {
            this.noSongs = true;
            this.songs = resData.songs;
          } else {
            this.noSongs = false;
            this.songs = resData.songs;
          }
        },
        error: error => {
          console.log(error);
        }
      })

  }

  deleteSong(songId: string) {
    this.deleteSongSubscription = this.songService.deleteSong(songId)
      .subscribe({
        next: resData => {
          return this.getSongs();
        },
        error: error => {
          console.log(error)
        }
      })
  }

  ngOnDestroy() {
    if (this.getSongsSubscription) this.getSongsSubscription.unsubscribe();
    if (this.deleteSongSubscription) this.deleteSongSubscription.unsubscribe();
    
  }

}
