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
    this.getSongsSubscription = this.songService.getSongs().subscribe(result => {
      if (result.songs === []) return this.noSongs = true;
      this.noSongs = false;
      this.songs = result.songs;
      this.artist = result.artist;
      return
    });
  }

  deleteSong(songId: string) {
    // this.deleteSongSubscription = this.songService.deleteSong(songId).subscribe(result => {
      
    // });
    this.deleteSongSubscription = this.songService.songDeletedResEvent.subscribe(result => {
      if (result.status !== 200) return;
      this.getSongs();
      return
    })
  }

  ngOnDestroy() {
    if (this.getSongsSubscription) this.getSongsSubscription.unsubscribe();
    if (this.deleteSongSubscription) this.deleteSongSubscription.unsubscribe();
    
  }

}
