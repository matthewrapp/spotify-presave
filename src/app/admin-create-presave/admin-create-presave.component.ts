import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Song } from '../models/song.model';
import { Artist } from '../models/artist.model';
import { ArtistService } from '../services/artist.service';
import { SongService } from '../services/song.service';

@Component({
  selector: 'sp-admin-create-presave',
  templateUrl: './admin-create-presave.component.html',
  styleUrls: ['./admin-create-presave.component.css']
})
export class AdminCreatePresaveComponent implements OnInit {
  errors: boolean = false;
  errorMsg: string = '';
  artists!: [any];
  noArtists!: Boolean;
  createPresaveForm!: FormGroup;

  constructor(private songService: SongService, private artistService: ArtistService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.artistService.getArtists();
    this.artistService.artistsChangedResEvent.subscribe(result => {
      const fetchedArtists = result.res.artists;
      if (result.status !== 200) return;
      if (fetchedArtists.length <= 0) return this.noArtists = true;

      this.noArtists = false;
      this.artists = fetchedArtists;

      this.initForm();
      return
    })

    return this.initForm();
  }

  createPresave(){
    const songName = this.createPresaveForm.value.songName;
    const releaseDate = this.createPresaveForm.value.releaseDate;
    const artworkUrl = this.createPresaveForm.value.artworkUrl ? this.createPresaveForm.value.artworkUrl : '';
    const spotifyUri = this.createPresaveForm.value.spotifyUri;
    const artistId = this.createPresaveForm.value.artistId;

    const newSong = new Song(songName, releaseDate, artworkUrl, spotifyUri, artistId);

    this.songService.writePresave(newSong);
    this.songService.presaveCreateResEvent.subscribe(result => {
        if (result.status !== 200) {
          this.errors = true;
          this.errorMsg = result.res.error.message;
          return
        }
        // if not, redirect to login
        this.errors = false;
        this.errorMsg = '';
        this.router.navigate(['/admin/songs'])
    })
  }

  private initForm() {
    this.createPresaveForm = new FormGroup({
      'songName': new FormControl('', [Validators.required]),
      'artistId': new FormControl('', Validators.required),
      'releaseDate': new FormControl('', Validators.required),
      'artworkUrl': new FormControl('', Validators.pattern(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/i)),
      'spotifyUri': new FormControl('', [Validators.required])
    })
  }

}
