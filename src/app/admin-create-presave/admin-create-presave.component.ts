import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { formatDate } from '@angular/common';

import { Song } from '../models/song.model';
import { Artist } from '../models/artist.model';
import { ArtistService } from '../services/artist.service';
import { SongService } from '../services/song.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sp-admin-create-presave',
  templateUrl: './admin-create-presave.component.html',
  styleUrls: ['./admin-create-presave.component.css']
})
export class AdminCreatePresaveComponent implements OnInit, OnDestroy {
  errors: boolean = false;
  errorMsg: string = '';
  editMode!: Boolean;
  songToEdit!: any;
  getSongSubscription!: Subscription;
  presaveCreatedSubscrition!: Subscription;
  presaveUpdatedSubscription!: Subscription;
  artists!: [any];
  noArtists!: Boolean;
  createPresaveForm!: FormGroup;

  constructor(private songService: SongService, private artistService: ArtistService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params['songId']) {
        this.getSongToEdit(params['songId']);
        return this.editMode = true;
      }
      return this.editMode = false;
    })

    this.getAdminArtists();

    if (this.editMode) return
    else this.initForm();
  }

  getSongToEdit(songId: string) {
    this.songService.getSong(songId);
    this.getSongSubscription = this.songService.getSongResEvent.subscribe(result => {
      this.songToEdit = result.res.song;
      return this.initForm();
    })
  };

  getAdminArtists() {
    this.artistService.getArtists();
    this.artistService.artistsChangedResEvent.subscribe(result => {
      const fetchedArtists = result.res.artists;
      if (result.status !== 200) return;
      if (fetchedArtists.length <= 0) return this.noArtists = true;

      this.noArtists = false;
      this.artists = fetchedArtists;
      return
    })
  }

  updatePresave() {
    const { songName, releaseDate, artworkUrl } = this.createPresaveForm.value;
    // non-editable fields
    const { spotifyUri, artist } = this.songToEdit;
    const presave = new Song(songName, releaseDate, artworkUrl ? artworkUrl : '', spotifyUri, artist);

    this.songService.updatePresave(presave, this.songToEdit._id);
    this.presaveUpdatedSubscription = this.songService.updatePresave(presave, this.songToEdit._id)
      .subscribe({
        next: resData => {
          this.errors = false;
          this.errorMsg = '';
          this.router.navigate(['/admin/songs']);
        },
        error: error => {
          this.errors = true;
          this.errorMsg = error.error.message;
        }
      })
  }

  submitPresave() {
    const { songName, releaseDate, artworkUrl, spotifyUri, artistId } = this.createPresaveForm.value;
    const presave = new Song(songName, releaseDate, artworkUrl ? artworkUrl : '', spotifyUri, artistId);
    this.presaveCreatedSubscrition = this.songService.writePresave(presave)
      .subscribe({
        next: resData => {
          this.errors = false;
          this.errorMsg = '';
          this.router.navigate(['/admin/songs']);
        },
        error: error => {
          this.errors = true;
          this.errorMsg = error.error.message;
        }
      })
  }

  ngOnDestroy(): void {
    if (this.getSongSubscription) this.getSongSubscription.unsubscribe();
    if (this.presaveCreatedSubscrition) this.presaveCreatedSubscrition.unsubscribe();
  }

  private async initForm() {
    if (this.editMode) {
      return this.createPresaveForm = new FormGroup({
        'songName': new FormControl(this.songToEdit?.songName, [Validators.required]),
        'releaseDate': new FormControl(formatDate(this.songToEdit?.releaseDate, 'yyyy-MM-dd', 'en'), Validators.required),
        'artworkUrl': new FormControl(this.songToEdit?.artworkUrl, Validators.pattern(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/i)),
      })
    } else {
      return this.createPresaveForm = new FormGroup({
        'songName': new FormControl('', [Validators.required]),
        'artistId': new FormControl('', Validators.required),
        'releaseDate': new FormControl('', Validators.required),
        'artworkUrl': new FormControl('', Validators.pattern(/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/i)),
        'spotifyUri': new FormControl('', [Validators.required])
      })
    }
    }
}
